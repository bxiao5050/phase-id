import Mark from 'Base/Mark'
import App from 'DOM/index'

/**
 * facebook web games javascript SDK
 */
export default class FacebookWebGames {

  FacebookWebGames = true

  static _ins: FacebookWebGames
  static get instance(): FacebookWebGames {
    return this._ins || new FacebookWebGames;
  }
  constructor() {
    FacebookWebGames._ins = this;
    this.ExposeApis()
    Mark.instance.init()
  }

  async Login() { // 调启登录
    console.log('调启登录')
    var loginRes = await SDK.Login({
      isFacebook: true
    })
    console.log(loginRes)
    if (loginRes.code === 200) {
      /**
       * 处理卡单
       */
      this.fbAsyncInit()

      App.instance.showHover(false)
      window.rgAsyncInit && window.rgAsyncInit()
    }
  }

  fbAsyncInit() {
    this.getPurchasesAsync()
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
    ]
    exposeApis.forEach(api => {
      window.RG[api] = SDK[api]
    })
    window.RG["Pay"] = this.Pay
  }

  /**
   * 支付接口
   * @param paymentConfig 
   */
  async Pay(payParams: RG.PayParams): Promise<ServerRes> {
    // if ('product_id' in payParams) {
    var paymentConfig = await SDK.PaymentConfig(payParams)
    if (paymentConfig.code === 200) {
      var orderingData = paymentConfig.payments.find(payment => {
        return payment.name === "Facebook"
      })
      var orderRes = await SDK.Ordering(orderingData)
      if (orderRes.code === 200) {
        var serverRes = await FacebookWebGames.instance.purchaseAsync(orderingData, orderRes)
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
    return FacebookWebGames.instance.consumePurchaseAsync(purchaseToken)
  }

  /**
   * facebook 消单
   * @param purchaseToken 
   */
  consumePurchaseAsync(purchaseToken: string): Promise<ServerRes> {
    return new Promise((resolve, reject) => {
      FB.api(
        '/' + purchaseToken + '/consume',    // Replace the PURCHASE_TOKEN
        'post',
        // { access_token: access_token },  
        ({ success }) => {
          if (success) { // facebook 消单成功
            RG.Mark('sdk_purchased_done')
            App.instance.showNotice(SDK.config.i18n.net_error_30200)
            resolve({
              code: 200,
              error_msg: ''
            })
          } else {
            reject({
              code: 0,
              error_msg: 'consume purchase failure'
            })
          }
        }
      )
    })
  }

  /**
   * 获取未消单的订单信息
   */
  getPurchasesAsync() {
    /**
     * https://developers.facebook.com/docs/games_payments/payments_lite
     */
    FB.api(
      '/app/purchases',
      'get',
      // { access_token: 'ACCESS_TOKEN' },
      (payload: {
        data: {
          app_id: number,
          developer_payload: string,
          payment_id: number,
          product_id: string,
          purchase_time: number,
          purchase_token: string,
          signed_request: string,
        }[],
        paging: {
          cursors: {
            after: string,
            before: string,
          }
        }
      }) => {
        if (payload.data.length > 0) { // 存在未消单订单 需要进行消单
          console.log('存在未消单订单 需要进行消单', payload)
          payload.data.forEach(data => {
            var { orderingData, orderRes } = JSON.parse(data.developer_payload)
            SDK.FinishOrder({
              transactionId: orderRes.data.transactionId,
              channel: orderingData.channel,
              receipt: data.payment_id + '',
              signature: data.signed_request,
              exInfo: ''
            }).then(serverRes => {
              FacebookWebGames.instance.serverFinishOrderCompleted(serverRes, data.purchase_token)
            })
          })
        }
      }
    )
  }

  /**
   * 购买商品
   * @param payParams 
   * @param orderingData 
   * @param orderRes 
   */
  purchaseAsync(orderingData, orderRes): Promise<ServerRes> {
    return new Promise(resolve => {
      FB.ui({
        method: 'pay',
        action: 'purchaseiap',
        product_id: orderingData.selectedProduct.productName,
        developer_payload: JSON.stringify({
          orderingData,
          orderRes
        })
      }, async (purchase) => {
        if (purchase && !purchase.error_code) {
          var serverRes = await SDK.FinishOrder({
            transactionId: orderRes.data.transactionId,
            channel: orderingData.channel,
            receipt: purchase.payment_id + '',
            signature: purchase.signed_request,
            exInfo: ''
          })
          if (serverRes.code === 200) {
            serverRes = await FacebookWebGames.instance.serverFinishOrderCompleted(serverRes, purchase.purchase_token)
            resolve(serverRes)
          }
        }
      })
    })
  }

}
