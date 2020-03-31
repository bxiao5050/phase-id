import Languages from 'DOM/i18n/index.ts';
import Native from './native';
import Web from './web';
import FacebookInstantGames from './facebookInstantGames';
import FacebookWebGames from './facebookWebGames';
import UniteSdk from './uniteSdk';

function initRG(w: Window) {
  /* 获取所有的地址栏参数 */
  const urlParams: UrlParams = getUrlParam();
  /* 挂载打补丁后执行的函数 */
  w.RgPolyfilled = RgPolyfilled;
  /* 打补丁 */
  polyfill();
  /* 打补丁后执行的函数 */
  async function RgPolyfilled() {
    urlParams.debugger && (await initDebugger());
    const {appId, advChannel} = urlParams;
    const type = getSdkType(urlParams.advChannel);
    let config = await getConfig(appId, advChannel);
    /* 第三方支付,关闭支付界面事件的注册 */
    w.addEventListener('message', function(event) {
      if (event.data === 'rgclose') RG.jssdk.App.hidePayment();
    });
    config.urlParams = urlParams;
    config.type = type;
    // 如果facebook挪到了微端,则不加载facebokSdk
    const WK = window['webkit'];
    if (!window.JsToNative.fbLogin || !(WK && WK.messageHandlers.fbLogin)) {
      fbSdkLoad(config.fb_app_id).then(() => {
       config.fb_sdk_loaded = true;
      });
    }
    await loadSdkWithType(config);

    /* sdk 加载完成的打点 */
    RG.Mark('sdk_loaded');
    /* 执行初始化函数 */
    RG.jssdk.init();
  }
  /* 打补丁 */
  function polyfill() {
    return new Promise(resolve => {
      const polyfills = ['Promise', 'Set', 'Map', 'Object.assign', 'Function.prototype.bind'];
      const polyfillUrl = 'https://polyfill.io/v3/polyfill.min.js';
      const features = polyfills.filter(feature => !(feature in w || w[feature]));
      if (!features.length) return resolve();
      var s = document.createElement('script');
      s.src = `${polyfillUrl}?features=${features.join(',')}&flags=gated,always&rum=0`;
      s.async = true;
      document.head.appendChild(s);
      s.onload = function() {
        resolve();
      };
    });
  }
  /* 获取所有的地址栏参数 */
  function getUrlParam() {
    var result = Object.create(null);
    var interrogationIndex = location.href.indexOf('?') + 1;
    var str = interrogationIndex === 0 ? '' : location.href.slice(interrogationIndex);
    if (str) {
      var arr = str.split(/&|%26/);
      arr.forEach(item => {
        var arr = item.split(/=|%3D/);
        var key = arr[0];
        var val = arr[1];
        result[key] = val;
      });
    }
    return result;
  }
  /* 初始化VConsole,用作微端的查看日志 */
  function initDebugger() {
    return new Promise(resolve => {
      var js = document.createElement('script');
      js.src = '//cdnjs.cloudflare.com/ajax/libs/vConsole/3.2.0/vconsole.min.js';
      js.onload = () => {
        new VConsole();
        resolve();
      };
      document.head.appendChild(js);
    });
  }
  /* 获取游戏的配置 */
  async function getConfig(appId: string, advChannel: string) {
    if (!appId || !advChannel) throw 'appId or advChannel is not defined';
    const gameConfig = await import(`./config/${appId}.ts`).then(module => {
      const configs = module.default;
      return configs[advChannel] ? configs[advChannel] : configs['1'];
    });
    return Object.assign(gameConfig, {i18n: Languages[gameConfig.language]});
  }
  /* 获取微端的sdk */
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
    } else if (advChannel > 33000 && advChannel < 35000) {
      //  联运sdk
      type = 5;
    } else {
      throw 'unknow advChannel';
    }
    return type;
  }
  /* 加载对应sdk */
  async function loadSdkWithType(config: any) {
    let sdk: Web | Native | FacebookInstantGames | FacebookWebGames | UniteSdk;
    const sdkType = config.type;
    switch (sdkType) {
      case 1:
        await import('Src/jssdk/web').then(module => {
          sdk = new module.default(config, false) as Web;
        });
        break;
      case 2:
        await import('Src/jssdk/native').then(module => {
          sdk = new module.default(config, false);
        });
        break;
      case 3:
        await import('Src/jssdk/facebookWebGames').then(module => {
          sdk = new module.default();
        });
        break;
      case 4:
        await import('Src/jssdk/facebookInstantGames').then(module => {
          sdk = new module.default();
        });
        break;
      case 5:
        await import('Src/jssdk/uniteSdk').then(module => {
          sdk = new module.default(config);
        });
        break;
    }
    return sdk;
  }
}

initRG(window);
