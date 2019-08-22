import { DOT } from "Src/jssdk/config/Constant";
import { checkJsToNative } from "./adapter";
import Http from "Base/Http";
// import Web from "./Web";
// import Native from "./Native";
// import Config from "./config";
import Languages from "DOM/i18n";

init(window);

function init(window: Window) {
  window.RgPolyfilled = RgPolyfilled;
  const urlParams = getUrlParam() as UrlParams;
  checkJsToNative(urlParams.appId, urlParams.advChannel);
  polyfill();
  async function RgPolyfilled() {

    (urlParams.debugger || window['debugger']) && await initDebugger();
    const config = await initSdk(urlParams.appId, urlParams.advChannel) as JSSDK.Config;
    Http.instance.init(urlParams.region);
    window.$rg_main = { config } as any;
    fbSdkLoad(config.fb_app_id).then(() => {
      RG.jssdk.fb_sdk_loaded = true;
    });

    if (+urlParams.advChannel < 33000) {
      // 现阶段兼容
      window.$postMessage = window.parent.postMessage.bind(window.parent);
      // 在本地测试的时候，修改$postMessage和修改region,此函数定义在dev中，webpack自动加载
      IS_DEV && (window.changePostmessageAndRegion && window.changePostmessageAndRegion(window));
      const indexUrl = (IS_DEV || IS_TEST) ? config.page.index.test : config.page.index.formal;
      if (config.type !== 2) {
        window.$postMessage(JSON.stringify({ action: "get" }), /(http|https):\/\/(www.)?([A-Za-z0-9-_]+(\.)?)+/.exec(indexUrl)[0]);
      }

      RG.Mark(DOT.SDK_LOADED);
      RG.jssdk.init();
    }

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
    const type = getSdkType(advChannel);
    let config = await getConfig(appId, advChannel);
    // 只用于web端的sdk，暂时先写在这里
    if (type === 1) {
      const indexUrl = IS_DEV ? config.page.index.test : config.page.index.formal
      window.addEventListener("message", onMessage(indexUrl), false);
    }
    config.urlParams = urlParams;
    config.type = type;
    await loadSdkWithType(config.type, config);
    return config
  }
  async function getConfig(appId: string, advChannel: string) {
    if (!appId || !advChannel) throw "appId or advChannel is not defined";
    const gameConfig = await import(`./config/${appId}_${advChannel}.ts`).then(module => module.default);
    return Object.assign(gameConfig, { appId, advChannel, i18n: Languages[gameConfig.language] });
  }
  function getSdkType(advChannelStr: string) {
    let type: number;
    const advChannel = Number(advChannelStr);

    if (advChannel > 30000 && advChannel < 31000) {
      // web端的sdk
      type = 1;
    } else if (advChannel < 30000) {
      // native端的sdk
      type = 2;
    } else if (advChannel > 31000 && advChannel < 32000) {
      // facebook webgame的sdk
      type = 3;
    } else if (advChannel > 32000 && advChannel < 33000) {
      // facebook instantgame的sdk
      type = 4;
    } else if (advChannel > 33000 && advChannel < 34000) {
      type = 5;
    } else if (advChannel > 33000 && advChannel < 35000) {
      type = 6;
    } else {
      throw "unknow advChannel";
    }
    return type;
  }
  async function loadSdkWithType(sdkType: number, config: any) {
    let sdk: any;
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
        await import("SDK/FacebookWebGames").then(module => {
          sdk = new module.default();
        });
        break;
      case 4:
        await import("SDK/FacebookInstantGames").then(module => {
          sdk = new module.default();
        });
        break;
      case 5:
        await import("SDK/uniteSdk/BTgame/ios").then(module => {
          sdk = new module.default(config);
        });
        break;
      case 6:
        await import("SDK/uniteSdk/BTgame/android").then(module => {
          sdk = new module.default(config);
        });
        break;

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
