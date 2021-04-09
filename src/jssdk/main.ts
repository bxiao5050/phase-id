import {loadJsSync, getUrlParams, loadJsRepeat} from './utils/index';

/* 加载 facebook jssdk */
function fbSdkLoad(fbAppId: string) {
  return new Promise<void>((resolve, reject) => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: fbAppId,
        status: true,
        xfbml: true,
        version: FBVersion,
        cookie: true
      });
      resolve();
    };
    (function (d, s, id) {
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
/* 获取游戏的配置 */
async function getConfig(appId: string, advChannel: string): Promise<ExtendedConfig> {
  if (!appId || !advChannel) throw new TypeError('appId or advChannel is not defined');
  return import(`./config/games/${appId}.ts`).then(module =>
    Object.assign({}, module.default.default, module.default[advChannel])
  );
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
  } /* else if (advChannel > 31000 && advChannel < 32000) {
      // facebook webgame的sdk
      return import('./sdks/facebookWebGame').then(module => {
        return new module.default(config);
      });
    } else if (advChannel > 32000 && advChannel < 33000) {
      // facebook instantgame的sdk
      return import('./sdks/facebookInstantGame').then(module => {
        return new module.default(config);
      });
    } */ else if (
    advChannel > 33000 &&
    advChannel < 35000
  ) {
    //  联运sdk
    return import('./sdks/uniteSdk/quick').then(module => {
      return new module.default(config);
    });
  } else {
    throw 'unknow advChannel';
  }
}

async function init() {
  /* 获取所有的地址栏参数 */
  const urlParams = getUrlParams<UrlParams>(location.href);
  // 加载config
  let config = await getConfig(urlParams.appId, urlParams.advChannel);
  config.urlParams = urlParams;
  // 是否需要加载 FB sdk
  const advChannel = +urlParams.advChannel;
  if (advChannel < 30000 || (advChannel > 32000 && advChannel < 33000)) {
    config.fb_sdk_loaded = true;
  } else {
    fbSdkLoad(config.fbAppId).then(() => {
      config.fb_sdk_loaded = true;
    });
  }
  /* 加载 react-js  */
  if (!IS_DEV) {
    await loadJsRepeat({url: reactSrc, id: 'rg-react'});
    await Promise.all([
      loadJsRepeat({url: reactDomSrc, id: 'rg-react-dom'}),
      loadJsRepeat({url: reactRouterDomSrc, id: 'rg-react-routerdom'})
    ]);
  }
  /* 加载 sdk */
  await loadSdk(config);
}

const modernBrowser = 'Promise' in window && 'Set' in window && 'Map' in window;

if (modernBrowser) {
  init();
} else {
  const url = VERSION === 'dev' ? './polyfills.js' : SERVER + 'polyfills.js';
  loadJsSync({url, id: 'rg-polyfills', success: init});
}
