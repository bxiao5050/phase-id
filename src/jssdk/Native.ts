import Http from 'Base/Http';
import { getUrlParam, signed, formatDate, getAccountType } from './utils';
import * as CryptoJS from 'crypto-js'
import { DOT } from 'Src/jssdk/Base/Constant';
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

    console.log(
      'this.ExposeApis() before'
    )

    this.ExposeApis()

    /**
     * 下单方法重写
     */
    window.RG.jssdk.Ordering = (function (Ordering) {

      return function (OrderingData: PaymentChannel) {
        return Ordering(OrderingData).then(orderRes => {
          console.log('jpwork.jpwork', OrderingData.showMethod, orderRes)
          if (orderRes.code === 200) { // 下单完成
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

  // rgAsyncInit() {
  //   window.rgAsyncInit()
  //   const index_origin = IS_DEV ? window.$rg_main.config.page.index.test : window.$rg_main.config.page.index.formal;
  //   window.parent.postMessage({ action: 'rgAsyncInit' }, /(http|https):\/\/(www.)?([A-Za-z0-9-_]+(\.)?)+/.exec(index_origin)[0])
  // }

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

    console.log(
      'RG.jssdk.nativeInit() before'
    )

    RG.jssdk.nativeInit();
    RG.Mark(DOT.SDK_LOADED);

    await this.loadScript(reactSrc)
    await Promise.all([reactDomSrc, reactRouterDomSrc].map((src) => {
      return this.loadScript(src)
    }))

    let [{ Ins }] = await Promise.all([import('DOM/index'), RG.jssdk.Account.initPromise()])

    window.RG.jssdk.App = Ins
    let user = RG.jssdk.Account.user
    let autoLogin = false
    let LoginModule = window.RG.jssdk.App.showLogin()
    let code = getUrlParam('code');

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
    //   let isGuest = getAccountType(userType, accountType) === 'guest' ? true : false;
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

  nativeInitResolve = null
  nativeInitPromise = new Promise(resolve => {
    this.nativeInitResolve = resolve
  })

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
        clientTime: formatDate(),
        firstInstall: 0,
        sign: signed([
          RG.jssdk.config.appId,
          source,
          RG.jssdk.config.advChannel,
          RG.jssdk.config.app_key
        ])
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
          window.JsToNative.init(JSON.stringify(initParam));
          this.nativeInitResolve()
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
    let result;
    try {
      result = JSON.parse(params);
    } catch (error) {
      result = params;
    }
    // 打点判断游戏方是否打点，如果打点就不打这个点
    // let result = JSON.parse(params)
    if (RG.jssdk.config.isPurchasedMark && result.code === 200) {
      RG.Mark(DOT.SDK_PURCHASED_DONE, {
        userId: RG.jssdk.CurUserInfo().userId,
        money: result.money,
        currency: result.currency,
      });
    }
    window.RG.jssdk.App.hidePayment();
  }

  consumeOrder(params: string) {
    // ios 的原生的调用会自动解析为对象，不需要我们进行解析
    let paramParse
    try {
      paramParse = JSON.parse(params)
    } catch (error) {
      console.log('ios params parse error', error);
      paramParse = params;
    }
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
      paymentConfigRes.payments.length && window.RG.jssdk.App.showPayment(paymentConfigRes)
    })
  }

  async Mark(markName: string, extraParam?: any) {
    await this.nativeInitPromise
    let eventName: string = markName;
    // 从配置中获取点名的配置
    if (RG.jssdk.config.mark_id.markName && RG.jssdk.config.mark_id.markName[eventName]) {
      eventName = RG.jssdk.config.mark_id.markName[eventName];
    }
    // 传递给原生的参数
    let markParmas: any = {
      eventName
    }
    // 获取adjust Token
    if (RG.jssdk.config.mark_id.adjust && RG.jssdk.config.mark_id.adjust[eventName]) {
      markParmas.eventToken = RG.jssdk.config.mark_id.adjust[eventName];
    }
    // sdk_purchased_done，原生端根据此字符串来做是否支付的判断,adjust只需要token，不要调整代码的顺序，最后匹配购买的点名
    if (eventName === "Purchased") {
      markParmas = Object.assign(extraParam, markParmas);
      markParmas.eventName = "sdk_purchased_done";
    }
    // 匹配唯一点
    if (RG.jssdk.config.mark_id.adjust && RG.jssdk.config.mark_id.adjust[eventName + '_unique']) {
      window.JsToNative.gameEvent(JSON.stringify({ eventName: eventName + '_unique', eventToken: RG.jssdk.config.mark_id.adjust[eventName + '_unique'] }));
      console.info(`"${eventName + '_unique'}" has marked - native`, { eventName: eventName + '_unique', eventToken: RG.jssdk.config.mark_id.adjust[eventName + '_unique'] })
    }
    // 打点、输出日志
    window.JsToNative.gameEvent(JSON.stringify(markParmas));
    console.info(`"${markParmas.eventName}" has marked - native`, markParmas);
  }
}
