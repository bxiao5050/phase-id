import Utils from "Base/Utils";
import { DOT, GET, ERROR } from "Base/Constant";
import { checkJsToNative } from "Src/adapter";
import Polyfill from "Base/Polyfill"
import Mark from "Base/Mark";
import Web from "./Web";

export default class Main {

  fb_sdk_loaded: boolean
  config: JSSDK.Config
  sdkInstance: Web
  Mark: Mark

  constructor() {
    window['rgMain'] = this as any
    window.RgPolyfilled = this.polyfilled
    checkJsToNative()
    Polyfill.instance.init()
  }

  polyfilled = async () => {
    try {
      await this.init()
      location.host === Mark.instance.game_host && RG.Mark(DOT.SDK_LOADED);
      location.host !== Mark.instance.index_host && (RG.jssdk as any).init()
    } catch (e) {
      console.error('error_log:', e)
      await this.get_sdk_instance()
      location.host === Mark.instance.game_host && RG.Mark(DOT.SDK_LOADED);
      location.host !== Mark.instance.index_host && (RG.jssdk as any).init()
    }
  }

  init_debugger() {
    return new Promise(resolve => {
      var js = document.createElement('script')
      js.src = "//cdnjs.cloudflare.com/ajax/libs/vConsole/3.2.0/vconsole.min.js"
      js.onload = () => {
        new VConsole
        console.log('cookie !@~@~@~@~@!~@^&^&~@^&%%~^&@%~^&@%~^&@^%#~^&%(~%@&~%(@')
        resolve()
      }
      document.head.appendChild(js)
    })
  }

  async init() {
    return new Promise(async (resolve, reject) => {
      try {
        (Utils.getUrlParam(GET.DEV) || window[GET.DEV]) && await this.init_debugger();
        await this.get_game_config
        Promise.all([
          this.get_sdk_instance(),
          this.facebook_jssdk_init(),
        ]).then(() => {
          resolve()
        }).catch(err => {
          reject(err)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  /** 获取游戏配置 */
  get_game_config = new Promise((resolve, reject) => {
    let appId = Utils.getUrlParam(GET.APP_ID) || window[GET.APP_ID]
    let advChannel = Utils.getUrlParam(GET.ADV_CHANNEL) || window[GET.ADV_CHANNEL]
    if (!appId || !advChannel) {
      reject(ERROR.E_001)
    } else {
      let config, translation
      Promise.all([
        new Promise(async function (resolve) {
          config = (await import('Src/config')).default[appId]
          config = config[advChannel] || config.default
          resolve()
        }),
        new Promise(async (resolve) => {
          translation = (await import('DOM/i18n')).default
          resolve()
        })
      ]).then(() => {
        this.config = Object.assign(config, {
          appId,
          advChannel,
          i18n: translation[config.language]
        })
        this.Mark = new Mark(this.config)
        resolve()
      })
    }
  })

  /**
   * 获取SDk的类型
   */
  get_sdk_instance() {
    let resolve, promise
    promise = new Promise(function (_) {
      resolve = _
    })
    if (this.config.advChannel > 30000 && this.config.advChannel < 31000) {
      this.config.type = 1
      import('Src/Web').then((module) => {
        this.sdkInstance = new module.default(this.config, this.fb_sdk_loaded)
        resolve()
      })
      return promise
    }
    else if (this.config.advChannel < 30000) {
      this.config.type = 2
      return import('Src/NativeGames')
    }
    else if (this.config.advChannel > 31000 && this.config.advChannel < 32000) {
      this.config.type = 3
      return import('Src/FacebookWebGames')
    }
    else if (this.config.advChannel > 32000 && this.config.advChannel < 33000) {
      this.config.type = 4
      return import('Src/FacebookInstantGames')
    }
  }

  facebook_jssdk_init() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = "https://connect.facebook.net/en_US/sdk.js"
      script.onload = () => {
        if (window.FB) {
          FB.init({
            appId: this.config.fb_app_id,
            status: true,
            xfbml: true,
            version: FBVersion
          })
          if (this.sdkInstance) {
            RG.jssdk.fb_sdk_loaded = true
          } else {
            this.fb_sdk_loaded = true
          }
          resolve()
        } else {
          reject('facebook jssdk onerror')
        }
      }
      script.onerror = function () {
        reject('facebook jssdk onerror')
      }
      document.head.appendChild(script)
    })
  }

}

new Main