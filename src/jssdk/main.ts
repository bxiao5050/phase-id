import { DOT, GET, ERROR } from "Base/Constant";
import { checkJsToNative } from "./adapter";
import Web from "./Web";
import Native from "./Native";
import Config from "./config";
import Languages from "DOM/i18n";

init(window);

function init(window: Window) {
  window.RgPolyfilled = RgPolyfilled;
  const urlParams = getUrlParam() as UrlParams;
  checkJsToNative(urlParams.appId, urlParams.advChannel);
  polyfill();
  async function RgPolyfilled() {

    window.$postMessage = window.parent.postMessage.bind(window.parent);
    (urlParams.debugger || window['debugger']) && await initDebugger();
    const config = await initSdk(urlParams.appId, urlParams.advChannel) as JSSDK.Config;
    // 现阶段兼容
    window.$rg_main = { config } as any;
    fbSdkLoad(config.fb_app_id).then(() => {
      RG.jssdk.fb_sdk_loaded = true;
    });
    // 在本地测试的时候，修改$postMessage
    IS_DEV && (await import("./dev"));
    const indexUrl = (IS_DEV || IS_TEST) ? config.page.index.test : config.page.index.formal;
    if (config.type !== 2) {
      window.$postMessage(JSON.stringify({ action: "get" }), /(http|https):\/\/(www.)?([A-Za-z0-9-_]+(\.)?)+/.exec(indexUrl)[0]);
    }

    RG.Mark(DOT.SDK_LOADED);
    RG.jssdk.init();
  }

  function polyfill() {
    const polyfills = ['Promise', 'Set', 'Map', 'Object.assign', 'Function.prototype.bind'];
    const polyfillUrl = 'https://polyfill.io/v3/polyfill.min.js';
    const features = polyfills.filter(feature => !(feature in window));
    if (!features.length) return window.RgPolyfilled()

    var s = document.createElement('script');
    s.src = `${polyfillUrl}?features=${features.join(',')}&flags=gated,always&rum=0`;
    s.async = true;
    document.head.appendChild(s);
    s.onload = function () {
      window.RgPolyfilled()
    }
  }
  function getUrlParam() {
    var result = Object.create(null);
    var interrogationIndex = location.href.indexOf("?") + 1
    var str = interrogationIndex === 0 ? "" : location.href.slice(interrogationIndex)
    if (str) {
      var arr = str.split(/&|%26/)
      arr.forEach(item => {
        var arr = item.split(/=|%3D/)
        var key = arr[0]
        var val = arr[1]
        result[key] = val
      })
    }
    return result;
  }
  function initDebugger() {
    return new Promise(resolve => {
      var js = document.createElement("script");
      js.src = "//cdnjs.cloudflare.com/ajax/libs/vConsole/3.2.0/vconsole.min.js";
      js.onload = () => {
        new VConsole();
        resolve();
      };
      document.head.appendChild(js);
    });
  }
  async function initSdk(appId: string, advChannel: string) {
    let config = getConfig(appId, advChannel);
    // 只用于web端的sdk，暂时先写在这里
    const indexUrl = IS_DEV ? config.page.index.test : config.page.index.formal
    window.addEventListener("message", onMessage(indexUrl), false);
    config.type = getSdkType(advChannel);
    await loadSdkWithType(config.type, config);
    return config
  }
  function getConfig(appId: string, advChannel: string) {
    if (!appId || !advChannel) throw "appId or advChannel is not defined";
    const gameConfig = Config[appId][advChannel] || Config[appId].default;
    return Object.assign(gameConfig, { appId, advChannel, i18n: Languages[gameConfig.language] });
  }
  function getSdkType(advChannelStr: string) {
    let type: number;
    const advChannel = Number(advChannelStr)
    if (advChannel > 30000 && advChannel < 31000) {
      type = 1;
    } else if (advChannel < 30000) {
      type = 2;
    } else if (advChannel > 31000 && advChannel < 32000) {
      type = 3;
    } else if (advChannel > 32000 && advChannel < 33000) {
      type = 4;
    } else {
      throw "unknow advChannel";
    }
    return type;
  }
  async function loadSdkWithType(sdkType: number, config: any) {
    let sdk: Web | Native;
    switch (sdkType) {
      case 1:
        await import("SDK/Web").then(module => {
          sdk = new module.default(config, false);
        });
        break;
      case 2:
        await import("SDK/Native").then(module => {
          sdk = new module.default(config, false);
        })
        break;
      case 3:
        return import("SDK/FacebookWebGames");
      case 4:
        return import("SDK/FacebookInstantGames");
    }
    return sdk;
  }
  function fbSdkLoad(fbAppId: string) {

    return new Promise((resolve, reject) => {
      window.fbAsyncInit = function () {
        FB.init({
          appId: fbAppId,
          status: true,
          xfbml: true,
          version: FBVersion
        });
        resolve();
      };
      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    })

  }
  function onMessage(indexUrl: string) {
    return function (event: MessageEvent) {
      if (event.origin !== /(http|https):\/\/(www.)?([A-Za-z0-9-_]+(\.)?)+/.exec(indexUrl)[0]) return;
      RG.jssdk.Account.init(JSON.parse(event.data));
    }
  }
}

type UrlParams = {
  appId: string;
  advChannel: string;
  sdkVersion: string;
  t: string;
  debugger?: boolean;
  advertiseId?: string;
}
