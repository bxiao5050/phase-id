// import Mark from 'Src/jssdk/0_Old/Mark_old'
import { Ins } from 'Src/jssdk/view/index'

export default class FacebookInstantGames {

  FacebookInstantGames = true
  isTest = false

  static _ins: FacebookInstantGames
  static get instance(): FacebookInstantGames {
    return this._ins || new FacebookInstantGames;
  }
  constructor() {
    FacebookInstantGames._ins = this;
    this.initFbInstantGames()
    this.ExposeApis()
    // Mark.instance.init()
  }

  ExposeApis() {
    window.RG = {} as any
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


  /**
  * 支付接口
  * @param paymentConfig
  */
  async Pay(payParams: RG.PayParams): Promise<ServerRes> {
    var paymentConfig = await RG.jssdk.PaymentConfig(payParams)
    if (paymentConfig.code === 200) {
      var orderingData = paymentConfig.payments.find(payment => {
        return payment.name === "Facebook"
      })
      var orderRes = await RG.jssdk.Ordering(orderingData)
      if (orderRes.code === 200) {
        var serverRes = await FacebookInstantGames.instance.purchaseAsync(orderingData, orderRes)
        return serverRes
      }
    }
  }

  /**
   * sdk 服务器消单完成
   * @param data
   * @param purchaseToken
   */
  serverFinishOrderCompleted(data: ServerRes, purchaseToken: string): Promise<ServerRes> {
    return FacebookInstantGames.instance.consumePurchaseAsync(purchaseToken)
  }

  /**
   * facebook 消单
   * @param purchaseToken
   */
  consumePurchaseAsync(purchaseToken: string): Promise<ServerRes> {
    return new Promise((resolve, reject) => {
      FBInstant.payments.consumePurchaseAsync(purchaseToken).then(function () {
        RG.Mark("sdk_purchased_done")
        Ins.showNotice(RG.jssdk.config.i18n.net_error_30200)
        resolve({
          code: 200,
          error_msg: ''
        })
      }).catch(err => {
        reject({
          code: 0,
          error_msg: 'consume purchase failure'
        })
      })
    })
  }

  /**
   * 获取未消单的订单信息
   */
  getPurchasesAsync() {
    FBInstant.payments.getPurchasesAsync().then(function (purchases) {
      if (purchases.length > 0) { // 存在未消单订单 需要进行消单
        purchases.forEach(purchase => {
          console.log('存在未消单订单 需要进行消单', purchases)
          purchases.forEach(purchase => {
            var { orderingData, orderRes } = JSON.parse(purchase.developerPayload)
            RG.jssdk.FinishOrder({
              transactionId: orderRes.data.transactionId,
              channel: orderingData.channel,
              receipt: purchase.paymentID + '',
              signature: purchase.signedRequest,
              exInfo: ''
            }).then(serverRes => {
              FacebookInstantGames.instance.serverFinishOrderCompleted(serverRes, purchase.purchaseToken)
            })
          })
        })
      }
    })
  }

  /**
   * 购买商品
   * @param payParams
   * @param orderingData
   * @param orderRes
   */
  purchaseAsync(orderingData, orderRes): Promise<ServerRes> {
    return new Promise(resolve => {
      var fbinstantPurchaseAsyncOption = {
        productID: orderingData.selectedProduct.productName,
        developerPayload: JSON.stringify({
          orderingData,
          orderRes
        })
      }
      console.log("​FacebookInstantGames -> fbinstantPurchaseAsyncOption", fbinstantPurchaseAsyncOption)
      FBInstant.payments.purchaseAsync(fbinstantPurchaseAsyncOption).then(async function (purchase) {
        var serverRes = await RG.jssdk.FinishOrder({
          transactionId: orderRes.data.transactionId,
          channel: orderingData.channel,
          receipt: purchase.paymentID + '',
          signature: purchase.signedRequest,
          exInfo: ''
        })
        if (serverRes.code === 200) {
          serverRes = await FacebookInstantGames.instance.serverFinishOrderCompleted(serverRes, purchase.purchaseToken)
          resolve(serverRes)
        }
      })
    })
  }

  private initFbInstantGames() {

    if (window.FBInstant) {
      this.FBInstantLoaded()
    } else {
      const srciptFBInstant = document.getElementById('FBInstant')
      srciptFBInstant && (srciptFBInstant.onload = () => {
        window.FBInstant && this.FBInstantLoaded()
      })
    }
  }

  FBInstantLoaded() {
    Promise.race([
      new Promise(resolve => {
        FBInstant.initializeAsync().then(() => {
          resolve(false)
        })
      }),
      new Promise(resolve => {
        setTimeout(function () {
          resolve(true)
        }, 1000)
      }),
    ]).then((isTest) => {
      this.isTest = isTest as boolean
      this.start()
    })
  }

  /**
   * FBInstant 初始化完成
   */
  start() {
    var delay = 300
    var len = 2
    var promise1 = new Promise(resolve => {
      for (var i = 0; i <= len; i++) {
        setTimeout((i) => {
          FBInstant.setLoadingProgress((i + 1) * 25)
          if (i === len) setTimeout(() => {
            resolve()
          }, delay)
        }, i * delay, i)
      }
    })
    Promise.all([promise1, this.promise2]).then(() => {
      console.log('调启登录')
      RG.jssdk.Login({
        isFacebook: true
      }).then((loginRes) => {
        console.log('登录完成')
        if (this.isTest) {
          Ins.showHover(false)
          window.rgAsyncInit && window.rgAsyncInit()
        } else {

          /**
           * 处理卡单
           */
          FBInstant.setLoadingProgress(100)
          if (loginRes.code === 200) {
            FBInstant.startGameAsync().then(() => {
              this.getPurchasesAsync()
              Ins.showHover(false)
              window.rgAsyncInit && window.rgAsyncInit()
            })
          }
        }


      })


    })


  }

  loginResolve
  promise2 = new Promise(resolve => {
    this.loginResolve = resolve
  })

  async Login() {
    this.loginResolve()
  }

  /**
   * 创建桌面快捷方式
   */
  CreateShortcut(): Promise<boolean> {
    return new Promise(resolve => {
      FBInstant.canCreateShortcutAsync().then(function (canCreateShortcut) {
        if (canCreateShortcut) {
          FBInstant.createShortcutAsync().then(function () {
            console.info('Shortcut created')
            resolve(true)
          }).catch(function (err) {
            console.error(err)
            resolve(false)
          })
        } else {
          console.error('can not CreateShortcut')
          resolve(false)
        }
      }).catch(function (err) {
        console.error(err)
        resolve(false)
      })
    })

  }

}

new FacebookInstantGames;

