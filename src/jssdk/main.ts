//import Languages from './view/i18n';

function initRG(w: Window) {
  /* 获取所有的地址栏参数 */
  const urlParams: UrlParams = getUrlParam();

  /* 打补丁 */
  polyfill().then(async res => {
    /* 是否加载 Vconsole */
    urlParams.debugger && (await initDebugger());
    const {appId, advChannel} = urlParams;
    // 加载config
    let config = await getConfig(appId, advChannel);
    /* 第三方支付,关闭支付界面事件的注册 */
    w.addEventListener('message', function(event) {
      if (event.data === 'rgclose') RG.jssdk.app.hidePayment();
    });
    config.urlParams = urlParams;
    // 如果facebook挪到了微端,则不加载facebokSdk
    const WK = window['webkit'];
    if (!(window.JsToNative && window.JsToNative.fbLogin) || !(WK && WK.messageHandlers.fbLogin)) {
      fbSdkLoad(config.fb_app_id).then(() => {
        config.fb_sdk_loaded = true;
      });
    } else {
      config.fb_sdk_loaded = true;
    }
    /* 加载对应的 sdk */
    await loadSdk(config);
  });
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
    const LanguagesPromise = import('./view/i18n/index').then(module => {
      return module.default;
    });
    const gameConfig = await import(`./config/${appId}.ts`).then(module => {
      const configs = module.default;
      return configs[advChannel] ? configs[advChannel] : configs.default;
    });
    const Languages = await LanguagesPromise;
    return Object.assign(gameConfig, {i18n: Languages[gameConfig.language]});
  }
  /* 加载对应sdk */
  function loadSdk(config: any) {
    // let sdk: Web | Native | FacebookInstantGames | FacebookWebGames | UniteSdk = null;
    const advChannel = +config.urlParams.advChannel;
    if (advChannel > 30000 && advChannel < 31000) {
      // web端的sdk
      return import('./sdks/web').then(module => {
        return new module.default(config);
      });
    } else if (advChannel < 30000) {
      // native端的sdk
      return import('./sdks/native').then(module => {
        return new module.default(config);
      });
    } else if (advChannel > 31000 && advChannel < 32000) {
      // facebook webgame的sdk
      // return import('Src/jssdk/facebookWebGames').then(module => {
      //   return new module.default();
      // });
    } else if (advChannel > 32000 && advChannel < 33000) {
      // facebook instantgame的sdk
      // return import('Src/jssdk/facebookInstantGames').then(module => {
      //   return new module.default();
      // });
    } else if (advChannel > 33000 && advChannel < 35000) {
      //  联运sdk
      // return import('Src/jssdk/uniteSdk').then(module => {
      //   return new module.default(config);
      // });
    } else {
      throw 'unknow advChannel';
    }
  }
  /* 加载 facebook jssdk */
  function fbSdkLoad(fbAppId: string) {
    return new Promise((resolve, reject) => {
      window.fbAsyncInit = function() {
        FB.init({
          appId: fbAppId,
          status: true,
          xfbml: true,
          version: FBVersion,
          cookie: true
        });
        resolve();
      };
      (function(d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    });
  }
}

initRG(window);

// /* sdk 加载完成的打点 */
// RG.Mark('sdk_loaded');
// /* 执行初始化函数 */
// RG.jssdk.init();
