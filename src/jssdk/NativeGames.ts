import Http from 'Src/Base/Http';
import Utils from 'Base/Utils';
import * as CryptoJS from 'crypto-js'
import { Ins } from 'DOM/index'
import { DOT } from './Base/Constant';
export default class NativeGames {

  NativeGames = true

  static _ins: NativeGames
  static get instance(): NativeGames {
    return NativeGames._ins || new NativeGames;
  }
  constructor() {
    NativeGames._ins = this
    /**
     * 下单方法重写
     */
    RG.jssdk.Ordering = (function (Ordering) {
      return function (OrderingData: PaymentChannel) {
        return Ordering(OrderingData).then(orderRes => {
          console.log('jpwork.jpwork', OrderingData.showMethod, orderRes)
          if (orderRes.code === 200) { // 下单完成
            if (OrderingData.showMethod === 3) {
              var jpParams = { // 获取Native的交易凭据 
                productName: OrderingData.selectedProduct.productName,
                transactionId: orderRes.data.transactionId,
                channel: OrderingData.channel,
                currency: OrderingData.selectedProduct.currency,
                money: OrderingData.selectedProduct.amount
              }
              var jpParamsStr = JSON.stringify(jpParams)
              console.log('jpParamsStr', jpParams, jpParamsStr)
              JsToNative.jpwork(jpParamsStr)
            }
          }
          return orderRes
        })
      }
    })(RG.jssdk.Ordering);
    NativeGames.instance.init()
  }

  Login() { // 调启登录
    var LoginModule = Ins.showLogin()
    var user = Utils.getUrlParam('user')

    var uu = RG.CurUserInfo()
    if (user) {
      var { userType, accountType } = RG.CurUserInfo()

      var isGuest = Utils.getAccountType(userType, accountType) === 'guest' ? true : false;
      Ins.hideLogin()
      Ins.showHover(isGuest)

      if (window.rgAsyncInit) {
        window.rgAsyncInit()

        if (RG.CurUserInfo().userId == 192711623) {
          RG.jssdk.initDebugger()
        }

      } else {
        window.onload = function () {
          window.rgAsyncInit()

          if (RG.CurUserInfo().userId == 192711623) {
            RG.jssdk.initDebugger()
          }

        }
      }
    } else {
      if (Utils.getUrlParam('code')) {
        RG.jssdk.Login({ isFacebook: true }).then(() => {
          LoginModule.loginComplete()
        })
      } else {
        var userInfo = RG.jssdk.GetUser()
        var autoLogin = false
        if (userInfo) {
          autoLogin = true
        } else {
          var usersInfo = RG.jssdk.GetUsers()
          var usersIdArr = Object.keys(usersInfo)
          if (usersIdArr.length) {
            var id = usersIdArr[0]
            userInfo = usersInfo[id]
            autoLogin = true
          }
        }
        if (autoLogin) {
          RG.jssdk.Login(userInfo).then(() => {
            LoginModule.loginComplete()
          })
        }
      }
    }
  }

  ExposeApis() {
    window.RG = <any>{}
    var exposeApis = [
      "server",
      "version",
      "Messenger",
      "Fb",
      "CurUserInfo",
      "BindZone",
      "Share",
      "Mark",
      "Pay"
    ]
    exposeApis.forEach(api => {
      window.RG[api] = RG.jssdk[api]
    })
  }

  key = CryptoJS.enc.Utf8.parse("flowerwordchangi");
  iv = CryptoJS.enc.Utf8.parse('0392039203920300');

  AESdecode(srcStr) {
    return CryptoJS.AES.decrypt(srcStr, NativeGames.instance.key, { iv: NativeGames.instance.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8)
  }

  init() {
    NativeGames.instance.ExposeApis()
    const WK = window['webkit']
    if (WK) {
      window.JsToNative = {
        getDeviceMsgAsync: function () {
          if (!NativeGames.instance.deviceMsgPromise) {
            NativeGames.instance.deviceMsgPromise = new Promise(resolve => {
              NativeGames.instance.deviceMsgResolve = resolve
            })
            WK.messageHandlers.getDeviceMsg.postMessage(null)
          }
          return NativeGames.instance.deviceMsgPromise
        },
        init: function (param: string) {
          WK.messageHandlers.init.postMessage(param)
        },
        gameEvent: function (param: string) {
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
        if (!NativeGames.instance.deviceMsgPromise) {
          NativeGames.instance.deviceMsgPromise = new Promise(resolve => {
            NativeGames.instance.deviceMsgResolve = resolve
          })
          setTimeout(function () {
            var data = JSON.parse(window.JsToNative.getDeviceMsg())
            data = Object.assign(data, {
              advChannel: RG.jssdk.config.advChannel,
              appId: RG.jssdk.config.appId
            })
            NativeGames.instance.deviceMsgResolve(data)
            NativeGames.instance.deviceMsgPromise = null
          })
        }
        return NativeGames.instance.deviceMsgPromise
      }
    }

    /**
     * 全局变量初始化
     */
    window.NativeToJs = {
      consumeOrder: NativeGames.instance.consumeOrder,
      jpworkResult: NativeGames.instance.jpworkResult,
      goBack: NativeGames.instance.goBack,
      deviceMsg: NativeGames.instance.gotDeviceMsg
    }

    NativeGames.instance.nativeInit()
  }

  deviceMsgPromise
  deviceMsgResolve


  gotDeviceMsg(deviceMsg: string) {
    var data = JSON.parse(deviceMsg)
    data = Object.assign(data, {
      advChannel: RG.jssdk.config.advChannel,
      appId: RG.jssdk.config.appId
    })
    NativeGames.instance.deviceMsgResolve(data)
    NativeGames.instance.deviceMsgPromise = null
  }

  nativeIsInit = false

  async nativeInit() {
    if (!NativeGames.instance.nativeIsInit) {
      var deviceMsg = await window.JsToNative.getDeviceMsgAsync()
      var { source, network, model, operatorOs, deviceNo, device, version } = deviceMsg
      var initSDKParam: initSDKParams = {
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
          NativeGames.instance.nativeIsInit = true
          var verifys = JSON.parse(NativeGames.instance.AESdecode(data.verifys))
          var initParam = {
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
    var result = JSON.parse(params)
    if (result.code === 200) {
      RG.Mark(DOT.SDK_PURCHASED_DONE, {
        userId: RG.jssdk.CurUserInfo().userId,
        money: result.money,
        currency: result.currency,
      })
    }
    Ins.hidePayment()
  }

  consumeOrder(params: string) {
    var paramParse: any = JSON.parse(params)
    console.log('native to js consumeOrder', paramParse)
    RG.jssdk.FinishOrder({
      transactionId: paramParse.transactionId,
      channel: paramParse.channel,
      receipt: paramParse.receipt,
      signature: paramParse.signature,
      exInfo: '',
    }).then(data => {
      console.log('JsToNative.consumeOrder1: code (' + data.code + ')', consumeParams)
      var consumeParams
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
        Ins.showNotice(RG.jssdk.config.i18n.UnknownErr)
        Ins.hidePayment()
      }
      console.log('JsToNative.consumeOrder2: code (' + data.code + ')', consumeParams)
      JsToNative.consumeOrder(JSON.stringify(consumeParams))
    })
  }

  Pay(paymentConfig: PaymentConfig) {
    NativeGames.instance.nativeInit()
    return RG.jssdk.PaymentConfig(paymentConfig).then(paymentConfigRes => {
      Ins.showPayment(paymentConfigRes)
    })
  }

  Mark(markName: string, extraParam?: any) {
    var markParmas: any = {
      eventName: markName
    }
    if (markName === DOT.SDK_PURCHASED_DONE) {
      markParmas = Object.assign(extraParam, markParmas)
    }
    console.info('mark params', markParmas)
    window.JsToNative.gameEvent(JSON.stringify(markParmas))
    console.info(`"${markName}" has marked - native`)
  }


}



