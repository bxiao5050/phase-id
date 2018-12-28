import Share from "Base/Share";
import Payment from "Base/Payment";
import Login from "Base/Login";
import Api from "Base/Api";
import Account from "Base/Account";
import Utils from "Base/Utils";
import Mark from "Base/Mark";

export default class Base {

  Account = Account.instance

  Mark(markName: string, markParams: any) {
    Mark.instance.Mark(markName)
  }

  Login(loginParam: LoginParam): Promise<LoginRes> {
    let promise: Promise<LoginRes>
    if (loginParam.isFacebook) { // facebook 登陆
      promise = Login.instance.facebookLogin()
    } else { // 平台登陆
      promise = Login.instance.platformLogin(loginParam)
    }
    return promise
  }

  BindZone(BindZoneParam: BindZoneParam) {
    return Api.instance.Bind(BindZoneParam)
  }

  Redirect() {
    window.name = 'redirect'
    location.reload()
  }

  CurUserInfo = (): JSSDK.CurUserInfo => {
    return RG.jssdk.Account.user || Utils.getUrlParam('user')
  }

  Share(shareUrl: string) {
    return Share.instance.share(shareUrl)
  }

  Messenger() {
    window.open(RG.jssdk.config.page.facebook.messenger)
  }

  Fb() {
    window.open(RG.jssdk.config.page.facebook.index)
    // let useragent = navigator.userAgent;
    // let iPhone = (useragent.match(/(iPad|iPhone|iPod)/g));
    // let scheme;
    // if (iPhone)
    //   scheme = "fb://page/?id=" + RG.jssdk.config.FbPageId;
    // else
    //   scheme = "fb://page/" + RG.jssdk.config.FbPageId;
    // if (!window.open(scheme)) {
    //   window.open(RG.jssdk.config.page.facebook.index)
    // }
  }

  static paymentConfig: PaymentConfig
  PaymentConfig(PaymentConfig: PaymentConfig): Promise<PaymentConfigRes> {
    Base.paymentConfig = PaymentConfig
    return Payment.instance.getPaymentConfig(PaymentConfig)
  }

  Ordering(OrderingData: PaymentChannel) {
    return Payment.instance.createOrder(Base.paymentConfig, {
      channel: OrderingData.channel,
      code: OrderingData.code,
      amount: OrderingData.selectedProduct.amount + '',
      currency: OrderingData.selectedProduct.currency,
      productName: OrderingData.selectedProduct.productName,
      itemType: OrderingData.selectedProduct.itemType,
      isOfficial: OrderingData.isOfficial,
      exInfo: OrderingData.exInfo,
    })
  }

  ChangeAccount = function () {
    return new Promise(function (resolve) {
      resolve()
    })
  }

  FinishOrder(finishOrderParams: FinishOrderParams): Promise<ServerRes> {
    return Payment.instance.finishOrder({
      transactionId: finishOrderParams.transactionId,
      channel: finishOrderParams.channel,
      receipt: finishOrderParams.receipt,
      signature: finishOrderParams.signature,
      exInfo: finishOrderParams.exInfo
    })
  }

  GetPaymentHistory() {
    return Payment.instance.getPaymentHistory()
  }

  ChangePassword(oldpass, newpass) {
    return Account.instance.changePass(oldpass, newpass)
  }

  VisitorUpgrade(account: string, pass: string) {
    return Api.instance.BindVisitor(account, pass)
  }

}