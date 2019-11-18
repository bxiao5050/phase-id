import Share from "Base/Share";
import Payment from "Base/Payment";
import Login from "Base/Login";
import Api from "Base/Api";
import Account from "Base/Account";
import { getUrlParam } from "Src/jssdk/utils";
// import Mark from "Src/Base/Mark_old";

export default class Base {

  Account = Account.instance

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
    window.name = 'redirect';
    let index = location.href.indexOf('&code=')
    let url = index === -1 ? location.href : location.href.substr(0, index);
    location.href = url;
    // location.reload();
  }

  CurUserInfo = (): JSSDK.CurUserInfo => {
    return RG.jssdk.Account.user || getUrlParam('user')
  }

  Share(shareUrl: string) {
    return Share.instance.share(shareUrl)
  }

  Messenger() {
    if (RG.jssdk.config.type === 1) {
      window.open(RG.jssdk.config.page.facebook.index);
    } else {
      window.open(RG.jssdk.config.page.facebook.messenger.mobile);
    }
    function isMobile() {
      var a = navigator.userAgent || navigator.vendor || window.opera;
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) return true;
      else return false;
    }
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

  FinishOrder(finishOrderParams: FinishOrderParams): Promise<Res> {
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
