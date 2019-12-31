/* 此文件已经废弃，下一次更新时删除 */
import { getUrlParam } from "Src/jssdk/common/utils";
import { checkJsToNative } from "SDK/adapter";
import Polyfill from "Src/jssdk/0_Old/Polyfill_old";
import Mark from "Src/jssdk/0_Old/Mark_old";
import Web from "../Web";
import Native from "../Native";
import { DOT ,GET} from 'Src/jssdk/0_Old/Constant_old';

export default class Main {
  fb_sdk_loaded: boolean;
  config: JSSDK.Config;
  sdkInstance: Web | Native;
  get_sdk_instance_promise;
  Mark: Mark;

  constructor() {
    window.$rg_main = this as any;
    window.RgPolyfilled = this.polyfilled;
    // checkJsToNative();
    Polyfill.instance.init();
  }

  polyfilled = async () => {
    window.$postMessage = function (params, origin) {
      if (RG.jssdk.config.type !== 2) window.parent.postMessage(params, origin);
    }
    IS_DEV && (await import("./dev"));
    try {
      await this.init();
      if ((location.host === Mark.instance.game_url.host &&
        location.pathname === Mark.instance.game_url.pathname) || IS_DEV) {
        RG.Mark(DOT.SDK_LOADED);
        RG.jssdk.init()
      }
    } catch (e) {
      console.error("error_log:", e);
      await this.get_sdk_instance_promise;
      if (location.host === Mark.instance.game_url.host &&
        location.pathname === Mark.instance.game_url.pathname) {
        RG.Mark(DOT.SDK_LOADED);
        RG.jssdk.init()
      }
    }
  };

  init_debugger() {
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

  async init() {
    return new Promise(async (resolve, reject) => {
      try {
        (getUrlParam(GET.DEV) || window[GET.DEV]) && (await this.init_debugger());
        await this.get_game_config;

        this.get_sdk_instance();
        Promise.all([this.get_sdk_instance_promise, this.facebook_jssdk_init()])
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  /** 获取游戏配置 */
  get_game_config = new Promise((resolve, reject) => {
    let appId = getUrlParam(GET.APP_ID) || window[GET.APP_ID];
    let advChannel = getUrlParam(GET.ADV_CHANNEL) || window[GET.ADV_CHANNEL];
    if (!appId || !advChannel) {
      reject('appId or advChannel is not defined');
    } else {
      let config, translation;
      Promise.all([
        new Promise(async function (resolve) {
          config = (await import("Src/jssdk/config")).default[appId];
          config = config[advChannel] || config.default;
          resolve();
        }),
        new Promise(async resolve => {
          translation = (await import("DOM/i18n/index"));
          resolve();
        })
      ])
        .then(() => {
          this.config = Object.assign(config, {
            appId,
            advChannel,
            i18n: translation[config.language]
          });
          return this.initAdjust();
        })
        .then(() => {
          this.Mark = new Mark(this.config);
          resolve();
        });
    }
  });

  onMessage(event: MessageEvent) {
    if (event.origin === window.$rg_main.Mark.index_url.origin) {
      RG.jssdk.Account.init(JSON.parse(event.data));
    }
  }

  /**
   * 获取SDk的类型
   */
  get_sdk_instance() {
    let get_sdk_instance_resolve: Function;
    this.get_sdk_instance_promise = new Promise(function (resolve) {
      get_sdk_instance_resolve = resolve;
    });

    this.get_sdk_instance_promise.then(() => {
      if (!Mark.instance.isIndex) {
        window.addEventListener("message", this.onMessage, false);
        window.$postMessage(JSON.stringify({ action: "get" }), window.$rg_main.Mark.index_url.origin);
      } else {
        const data = {
          user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : "",
          users: localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : {}
        };
        RG.jssdk.Account.init(data);
      }
    });

    if (this.config.advChannel > 30000 && this.config.advChannel < 31000) {
      this.config.type = 1;
      import("SDK/Web").then(module => {
        this.sdkInstance = new module.default(this.config, this.fb_sdk_loaded);
        get_sdk_instance_resolve();
      })
    } else if (this.config.advChannel < 30000) {
      this.config.type = 2;
      import("SDK/Native").then(module => {
        this.sdkInstance = new module.default(this.config, this.fb_sdk_loaded);
        get_sdk_instance_resolve();
      })
    } else if (
      this.config.advChannel > 31000 &&
      this.config.advChannel < 32000
    ) {
      this.config.type = 3;
      return import("Src/jssdk/FacebookWebGames");
    } else if (this.config.advChannel > 32000 && this.config.advChannel < 33000) {
      this.config.type = 4;
      return import("Src/jssdk/FacebookInstantGames");
    }
  }

  facebook_jssdk_init() {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.onload = () => {
        if (window.FB) {
          window.FB.init({
            appId: this.config.fb_app_id,
            status: true,
            xfbml: true,
            version: FBVersion
          });
          if (this.sdkInstance) {
            RG.jssdk.fb_sdk_loaded = true;
          } else {
            this.fb_sdk_loaded = true;
          }
          resolve();
        } else {
          reject("facebook jssdk onerror");
        }
      };
      script.onerror = function () {
        reject("facebook jssdk onerror");
      };
      document.head.appendChild(script);
    });
  }
  /**
   * 加载adjust的全局打点代码
   */
  initAdjust() {
    return new Promise((resolve, reject) => {
      if (this.config.mark_id.adjust.id) {
        import("Base/adjust.min.js" as any)
          .then(() => {
            if (Adjust) {
              resolve();
            } else {
              reject("init Adjust failed");
            }
          })
          .catch(err => {
            reject("init Adjust failed" + err);
          });
      } else {
        resolve();
      }
    });
  }
}

new Main();
