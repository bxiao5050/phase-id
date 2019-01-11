import Http from 'Src/Base/Http';
import Utils from 'Base/Utils';
import * as CryptoJS from 'crypto-js'
import { DOT } from './Base/Constant';
import Base from './Base';

export default class Native extends Base {

  config
  fb_sdk_loaded

  static instance
  constructor(config, fb_sdk_loaded) {
    super()

    this.config = config
    this.fb_sdk_loaded = fb_sdk_loaded

    let RG = function () { }
    RG.prototype.jssdk = this

    window.RG = new RG
    this.ExposeApis()

    /**
     * 下单方法重写
     */
    window.RG.jssdk.Ordering = (function (Ordering) {
      return function (OrderingData: PaymentChannel) {
        return Ordering(OrderingData).then(orderRes => {
          console.log('jpwork.jpwork', OrderingData.showMethod, orderRes)
          if (orderRes.code === 200) { // 下单完成
            if (OrderingData.showMethod === 3) {
              let jpParams = { // 获取Native的交易凭据 
                productName: OrderingData.selectedProduct.productName,
                transactionId: orderRes.data.transactionId,
                channel: OrderingData.channel,
                currency: OrderingData.selectedProduct.currency,
                money: OrderingData.selectedProduct.amount
              }
              let jpParamsStr = JSON.stringify(jpParams)
              console.log('jpParamsStr', jpParams, jpParamsStr)
              JsToNative.jpwork(jpParamsStr)
            }
          }
          return orderRes
        })
      }
    })(window.RG.jssdk.Ordering);

  }

  loadScript(src) {
    let resolve, script = document.createElement('script')
    script.src = src
    script.onload = function () {
      resolve()
    }
    document.head.appendChild(script)
    return new Promise(function (_) {
      resolve = _
    })
  }

  rgAsyncInit() {
    window.rgAsyncInit()
    window.parent.postMessage({ action: 'rgAsyncInit' }, window.$rg_main.Mark.index_url.origin)
  }

  ExposeApis() {
    let exposeApis = [
      "server",
      "version",
      "Redirect",
      "Messenger",
      "Fb",
      "CurUserInfo",
      "BindZone",
      "Share",
      "Mark",
      "Pay",
      "ChangeAccount"
    ]
    exposeApis.forEach(api => {
      window.RG[api] = RG.jssdk[api]
    })
  }

  key = CryptoJS.enc.Utf8.parse("flowerwordchangi");
  iv = CryptoJS.enc.Utf8.parse('0392039203920300');

  AESdecode(srcStr) {
    return CryptoJS.AES.decrypt(srcStr, RG.jssdk.key, { iv: RG.jssdk.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8)
  }

  async init() {

    const WK = window['webkit']
    if (WK) {
      window.JsToNative = {
        getDeviceMsgAsync: function () {
          if (!RG.jssdk.deviceMsgPromise) {
            RG.jssdk.deviceMsgPromise = new Promise(resolve => {
              RG.jssdk.deviceMsgResolve = resolve
            })
            WK.messageHandlers.getDeviceMsg.postMessage(null)
          }
          return RG.jssdk.deviceMsgPromise
        },
        init: function (param: string) {
          WK.messageHandlers.init.postMessage(param)
        },
        gameEvent: function (param: string) {
          console.log('gameEvent', param)
          WK.messageHandlers.gameEvent.postMessage(param)
        },
        jpwork: function (param: string) {
          WK.messageHandlers.jpwork.postMessage(param)
        },
        consumeOrder: function (param: string) {
          WK.messageHandlers.consumeOrder.postMessage(param)
        },
        exitApp: function () {
          WK.messageHandlers.exitApp.postMessage(null)
        }
      } as any
    } else {
      window.JsToNative.getDeviceMsgAsync = () => {
        if (!RG.jssdk.deviceMsgPromise) {
          RG.jssdk.deviceMsgPromise = new Promise(resolve => {
            RG.jssdk.deviceMsgResolve = resolve
          })
          setTimeout(function () {
            let data = JSON.parse(window.JsToNative.getDeviceMsg())
            data = Object.assign(data, {
              advChannel: RG.jssdk.config.advChannel,
              appId: RG.jssdk.config.appId
            })
          
            RG.jssdk.deviceMsgResolve(data)
            RG.jssdk.deviceMsgPromise = null
          })
        }
        return RG.jssdk.deviceMsgPromise
      }
    }
    /**
     * 全局变量初始化
     */
    window.NativeToJs = {
      consumeOrder: RG.jssdk.consumeOrder,
      jpworkResult: RG.jssdk.jpworkResult,
      goBack: RG.jssdk.goBack,
      deviceMsg: RG.jssdk.gotDeviceMsg
    }
    RG.jssdk.nativeInit()

    
    await this.loadScript(reactSrc)
    await Promise.all([reactDomSrc, reactRouterDomSrc].map((src) => {
      return this.loadScript(src)
    }))

    let [{ Ins }] = await Promise.all([import('DOM/index'), RG.jssdk.Account.initPromise()])

    window.RG.jssdk.App = Ins
    let user = RG.jssdk.Account.user
    let autoLogin = false
    let LoginModule = window.RG.jssdk.App.showLogin()
    let code = Utils.getUrlParam('code')

    if (code) {
      await RG.jssdk.Login({ isFacebook: true })
      LoginModule.loginComplete()
    } else {
      if (user) {
        autoLogin = true
      } else {
        if (RG.jssdk.Account.users) {
          let usersIdArr = Object.keys(RG.jssdk.Account.users)
          if (usersIdArr.length) {
            user = RG.jssdk.Account.users[
              usersIdArr[0]
            ]
            autoLogin = true
          }
        }
      }
      let LoginModule = window.RG.jssdk.App.showLogin()
      if (window.name === 'redirect') {
        window.name = ''
      } else {
        if (autoLogin) {
          await RG.jssdk.Login(user)
          LoginModule.loginComplete()
        }
      }
    }


    // if (user) {
    //   let { userType, accountType } = user
    //   let isGuest = Utils.getAccountType(userType, accountType) === 'guest' ? true : false;
    //   window.RG.jssdk.App.hideLogin()
    //   window.RG.jssdk.App.showHover(isGuest)
    //   if (window.rgAsyncInit) {
    //     window.rgAsyncInit()
    //     // if (RG.CurUserInfo().userId == 192711623) {
    //     //   RG.jssdk.initDebugger()
    //     // }
    //   } else {
    //     window.onload = function () {
    //       window.rgAsyncInit()
    //       // if (RG.CurUserInfo().userId == 192711623) {
    //       //   RG.jssdk.initDebugger()
    //       // }
    //     }
    //   }
    // } else {
    // }

   
  }

  deviceMsgPromise
  deviceMsgResolve

  gotDeviceMsg(deviceMsg: string) {
    let data = JSON.parse(deviceMsg)
    data = Object.assign(data, {
      advChannel: RG.jssdk.config.advChannel,
      appId: RG.jssdk.config.appId
    })
    RG.jssdk.deviceMsgResolve(data)
    RG.jssdk.deviceMsgPromise = null
  }

  nativeIsInit = false

  async nativeInit() {
    if (!RG.jssdk.nativeIsInit) {
      let deviceMsg = await window.JsToNative.getDeviceMsgAsync()
      let { source, network, model, operatorOs, deviceNo, device, version } = deviceMsg
      let initSDKParam: initSDKParams = {
        appId: RG.jssdk.config.appId,
        source: source,
        advChannel: RG.jssdk.config.advChannel,
        network: network,
        model: model,
        operatorOs: operatorOs,
        deviceNo: deviceNo,
        device: device,
        version: version,
        sdkVersion: RG.jssdk.version,
        clientTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
        firstInstall: 0,
        sign: Utils.signed({
          appId: RG.jssdk.config.appId,
          source: source,
          advChannel: RG.jssdk.config.advChannel,
        })
      }

      console.log('initSDKParams', initSDKParam)

      Http.instance.post({
        route: '/config/v3.1/initSDK',
        data: initSDKParam
      }).then((data: {
        code: number
        error_msg: string
        messages: {
          loginMessageUrl: string
          isHasLogin: string
          isHasPause: string
          pauseMessageUrl: string
        }
        handlerBtns: {
          btnName: string
          btnNormalIcon: string
          btnNormalPressIcon: string
          btnRedIcon: string
          btnRedPressIcon: string
          btnUrl: string
          showRedSpots: string
        }[]
        loginMethods: {
          loginMethod: string
          iconUrl: string
          loginUrl: string
          callBackUrl: string
          index: string
          rotate: number
        }[]
        verifys: { // AES加密的
          gpVerify: string
          gpProduct: string
        }
        advChannels: { // android
          facebookAppId: string
          appsFlyerDevKey: string
          talkapp_key: string
          charboostAppId: string
          charboostAppSignature: string
          ewayAppId: string
          mobvistaSDKAppId: string
          admobConversionID: string
          admobValue: string
        }
      }) => {
        if (data.code === 200) {
          RG.jssdk.nativeIsInit = true
          let verifys = JSON.parse(RG.jssdk.AESdecode(data.verifys))
          let initParam = {
            gpProduct: verifys.gpProduct,
            gpVerify: verifys.gpVerify
          }
          console.log('调用 window.JsToNative.init')
          window.JsToNative.init(JSON.stringify(initParam))
          console.log('init completed', initParam)
        } else {
          console.log('初始化失败')
          console.log(data)
        }

      }).catch(err => {
        console.log('init err', err)
      })
    }
  }

  goBack() {
    if (confirm(RG.jssdk.config.i18n.tuichu)) {
      JsToNative.exitApp()
    }
  }

  jpworkResult(params: string) {
    console.log('jpworkResult', params)
    let result = JSON.parse(params)
    if (result.code === 200) {
      RG.Mark(DOT.SDK_PURCHASED_DONE, {
        userId: RG.jssdk.CurUserInfo().userId,
        money: result.money,
        currency: result.currency,
      })
    }
    window.RG.jssdk.App.hidePayment()
  }

  consumeOrder(params: string) {
    let paramParse: any = JSON.parse(params)
    console.log('native to js consumeOrder', paramParse)
    RG.jssdk.FinishOrder({
      transactionId: paramParse.transactionId,
      channel: paramParse.channel,
      receipt: paramParse.receipt,
      signature: paramParse.signature,
      exInfo: '',
    }).then(data => {
      console.log('JsToNative.consumeOrder1: code (' + data.code + ')')
      let consumeParams
      if (data.code === 200) {
        consumeParams = {
          code: data.code,
          exInfo: paramParse.exInfo
        }
      } else {
        consumeParams = {
          code: data.code,
          error_msg: data.error_msg,
          exInfo: paramParse.exInfo
        }
        window.RG.jssdk.App.showNotice(RG.jssdk.config.i18n.UnknownErr)
        window.RG.jssdk.App.hidePayment()
      }
      console.log('JsToNative.consumeOrder2: code (' + data.code + ')', consumeParams)
      JsToNative.consumeOrder(JSON.stringify(consumeParams))
    })
  }

  Pay(paymentConfig: PaymentConfig) {
    RG.jssdk.nativeInit()
    return RG.jssdk.PaymentConfig(paymentConfig).then(paymentConfigRes => {
      window.RG.jssdk.App.showPayment(paymentConfigRes)
    })
  }

  Mark(markName: string, extraParam?: any) {
    let markParmas: any = {
      eventName: markName,
      eventToken: RG.jssdk.config.adjust[markName]
    }
    if (markName === DOT.SDK_PURCHASED_DONE) {
      markParmas = Object.assign(extraParam, markParmas)
    }
    window.JsToNative.gameEvent(JSON.stringify(markParmas))
    console.info(`"${markName}" has marked - native`, markParmas)
  }


}



