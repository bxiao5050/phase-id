import Utils from "Base/Utils";
import { DOT, GET, ERROR } from "Base/Constant";
import { checkJsToNative } from "Src/adapter";
import Polyfill from "Base/Polyfill"
import Mark from "./Base/Mark";

export default class Main {

  fb_sdk_loaded = false
  config: JSSDK.Config
  sdkInstance

  constructor() {
    window.RgPolyfilled = this.polyfilled.bind(this)
    checkJsToNative()
    Polyfill.instance.init()
  }

  polyfilled() {
    this.init().then(() => {
      location.origin === Mark.instance.gameOrigin && RG.Mark(DOT.SDK_LOADED);
      (RG.jssdk as any).init()
    }).catch(() => {
      this.getSDKInstance().then(() => {
        location.origin === Mark.instance.gameOrigin && RG.Mark(DOT.SDK_LOADED);
        (RG.jssdk as any).init()
      })
    })
  }

  initDebugger() {
    return new Promise(resolve => {
      var js = document.createElement('script')
      js.src = "https://sdk-sg.pocketgamesol.com/jssdk/vconsole/vconsole.min.js"
      js.onload = () => {
        new VConsole
        resolve()
      }
      document.head.appendChild(js)
    })
  }

  async init() {
    let AndroidVersion = navigator.userAgent.match(/Android \d{1}.\d{1}/)
    let isLge4_4
    if (AndroidVersion) isLge4_4 = Number(AndroidVersion[0].split(' ')[1]) >= 4.4;
    if (Utils.getUrlParam(GET.DEBUGGER) || window[GET.DEBUGGER]) {
      if (AndroidVersion) {
        if (isLge4_4) await this.initDebugger();
      } else {
        await this.initDebugger();
      }
    }
    await this.gameConfig()
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getSDKInstance(),
        this.initFbJsSdk(),
      ]).then(() => {
        resolve()
      }).catch(err => {
        console.error(err)
        reject(err)
      })
    })
  }

  /** 获取游戏配置 */
  async gameConfig() {
    return new Promise((resolve) => {
      let appId = Utils.getUrlParam(GET.APP_ID) || window[GET.APP_ID]
      let advChannel = Utils.getUrlParam(GET.ADV_CHANNEL) || window[GET.ADV_CHANNEL]
      if (!appId || !advChannel) {
        console.error(ERROR.E_001)
      } else {
        let config, translation
        Promise.all([
          new Promise(async function (resolve) {
            config = (await import('Src/config')).default[appId]
            config = config[advChannel] || config.default
            window.RG && window.RG['gameConfig'] && window.RG['gameConfig'](config)
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
          resolve()
        })
      }
    })
  }

  /**
   * 获取SDk的类型
   */
  getSDKInstance() {
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

  initFbJsSdk() {
    return new Promise((resolve, reject) => {
      if (this.config.type === 4) { // instant games
        this.fb_sdk_loaded = true
        resolve()
        return
      }
      var js = document.createElement('script')
      document.body.appendChild(js)
      js.src = "https://connect.facebook.net/en_US/sdk.js"
      js.onload = () => {
        if (window.FB) {
          FB.init({
            appId: this.config.FbAppID,
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
          console.error('RG: Facebook SDK failed to load')
        }
      }
      js.onerror = function () {
        console.error('RG: Facebook SDK failed to load2')
        reject('fb')
      }
    })
  }

}

new Main