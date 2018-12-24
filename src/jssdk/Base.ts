import Share from "Base/Share";
import Payment from "Base/Payment";
import Login from "Base/Login";
import Api from "Base/Api";
import Account from "Base/Account";
import Utils from "Base/Utils";
import Mark from "Base/Mark";

export default class Base {

  version = VERSION

  // getUrlParam = Utils.getUrlParam

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

  GetUser() {
    let userInfo = Account.instance.userInfo
    return userInfo
  }

  GetUsers() {
    return Account.instance.usersInfo
  }

  Redirect() {
    let urlParam = Utils.getUrlParam()
    let urlSearch = ''
    let $i = 0
    for (let name in urlParam) {
      if (name === 'user') {
        continue
      } else {
        urlSearch += (($i ? '&' : '?') + name + '=' + urlParam[name])
        $i++
      }
    }
    let href = SERVER + Utils.getUrlParam('sdkVersion') + '/login.html' + urlSearch
    console.log('Redirect', href)
    location.href = href
  }

  SetUser(userInfo: UserInfo, userId?: any) {
    if (userInfo) {
      Account.instance.userInfo = userInfo
    } else {
      Account.instance.delCurUser(userId)
    }
  }

  SetUsers(usersInfo: UsersInfo) {
    Account.instance.usersInfo = usersInfo
  }

  _getParamUserHasParsed = false
  CurUserInfo = (): JSSDK.CurUserInfo => {
    let user = Utils.getUrlParam('user')
    if (user && !this._getParamUserHasParsed) {
      this._getParamUserHasParsed = true
      user = JSON.parse(decodeURIComponent(user))
      this.SetUser(user)
      return user
    } else {
      return this.GetUser()
    }
  }

  Share(shareUrl: string) {
    return Share.instance.share(shareUrl)
  }

  Messenger() {
    console.log("Messenger")
    // return window.open(RG.jssdk.config.messenger)
  }

  Fb() {
    console.log("Fb")
    // let useragent = navigator.userAgent; // cache the userAgent info
    // let iPhone = (useragent.match(/(iPad|iPhone|iPod)/g));
    // let scheme;
    // if (iPhone)
    //   scheme = "fb://page/?id=" + RG.jssdk.config.FbPageId;
    // else
    //   scheme = "fb://page/" + RG.jssdk.config.FbPageId;

    // if (!window.open(scheme)) {
    //   location.href = RG.jssdk.config.fanpage;
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

  ChangeAccount = new Promise(function (resolve) {
    resolve()
  })

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