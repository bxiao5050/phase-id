import Base from '../base';
import IosApi from './ios';
import AndroidApi from './android';
import {loadJsRepeat} from '../../utlis';
import {initRG} from '../rg';
import {fbLogin, fbShare} from '../../utlis/fb';
/* 引入类型 */
import {ConsumeOrderParams, FbLoginRes, FbShareRes} from './android';

export default class NativeSdk extends Base {
  type: 2;
  native: IosApi | AndroidApi;
  constructor(config: JSSDK.Config) {
    super();
    this.initConfig(config);
    this.initNative();
    this.initNativeToJs();
    initRG(this);
  }
  async init() {
    /* 加载 react-js  */
    await loadJsRepeat({url: '', id: 'rg-react'});
    await Promise.all([
      loadJsRepeat({url: reactDomSrc, id: 'rg-react-dom'}),
      loadJsRepeat({url: reactRouterDomSrc, id: 'rg-react-routerdom'})
    ]);
    // const {Ins} = await import("../../")
  }
  async pay() {}
  async mark() {}
  async order(params: PaymentChannel) {
    return this.createOrder(params).then(res => {
      if (res.code === 200 && params.showMethod === 3) {
        this.native.jpwork({
          productName: params.selectedProduct.productName,
          transactionId: res.data.transactionId,
          channel: params.channel,
          money: params.selectedProduct.amount,
          currency: params.selectedProduct.currency,
          userId: this.account.user.userId
        });
      }
      return res;
    });
  }
  get devicePromise() {
    return this.native.getDeviceMsg();
  }
  async fbLogin(isLogout: boolean) {
    let fbUserInfo: FbLoginRes = null;
    if (this.native.hasFbLogin) {
      fbUserInfo = await this.native.fbLogin();
    } else {
      fbUserInfo = await fbLogin(this.config.fbAppId, isLogout);
    }
    if (fbUserInfo) {
      return this.platformRegister(fbUserInfo);
    } else {
      console.error('fbLogin error');
    }
  }
  async fbShare(url: string) {
    if (this.native.hasFbShare) {
      return this.native.fbShare(url);
    } else {
      return fbShare(url);
    }
  }

  openFanPage() {
    window.open(this.config.page.facebook.index);
  }
  initNative() {
    if (window.webkit) {
      this.native = new IosApi();
    } else {
      this.native = new AndroidApi();
    }
  }
  initNativeToJs() {
    const that = this;
    window.NativeToJs = {
      consumeOrder: function(params: string | FinishOrderParams) {
        let data: FinishOrderParams = params as FinishOrderParams;
        if (typeof params === 'string') {
          data = JSON.parse(params);
        }
        that
          .finishOrder({
            transactionId: data.transactionId,
            channel: data.channel,
            receipt: data.receipt,
            signature: data.signature,
            exInfo: ''
          })
          .then(res => {
            let result: ConsumeOrderParams;
            if (res.code === 200) {
              result = {
                code: res.code,
                exInfo: data.exInfo
              };
            } else {
              result = {
                code: res.code,
                error_msg: res.error_msg,
                exInfo: data.exInfo
              };
              window.RG.jssdk.App.showNotice(RG.jssdk.config.i18n.UnknownErr);
            }
            that.native.consumeOrder(result);
            window.RG.jssdk.App.hidePayment();
          });
      },
      jpworkResult: function(params: string | JpworkResultParams) {
        let data: JpworkResultParams = params as JpworkResultParams;
        if (typeof params === 'string') {
          data = JSON.parse(params);
        }
        if (RG.jssdk.config.isPurchasedMark && data.code === 200) {
          RG.Mark('sdk_purchased_done', {
            userId: RG.CurUserInfo().userId,
            money: data.money,
            currency: data.currency
          });
        }
      },
      goBack: function() {
        if (confirm(RG.jssdk.config.i18n.tuichu)) JsToNative.exitApp();
      },
      deviceMsg: function(params: string | DeviceMsg) {
        let result: DeviceMsg = params as DeviceMsg;
        if (typeof params === 'string') {
          result = JSON.parse(params);
        }
        (that.native as IosApi).deviceMsgResolve(result);
        (that.native as IosApi).deviceMsgPromise = null;
      },
      fbShareHandle: function(params: string | FbShareRes) {
        let result: FbShareRes = params as FbShareRes;
        if (typeof params === 'string') {
          result = JSON.parse(params);
        }
        that.native.fbLoginResolve(result);
        that.native.fbSharePromise = null;
      },
      fbLoginHandle: function(params: string | FbLoginRes) {
        let result: FbLoginRes = params as FbLoginRes;
        if (typeof params === 'string') {
          result = JSON.parse(params);
        }
        result.userName = 'fb-' + result.userId;
        result.password = '';
        result.accountType = 2;
        result.userChannel = 0;
        that.native.fbLoginResolve(result);
        that.native.fbLoginPromise = null;
      }
    };
  }
}
interface JpworkResultParams {
  code: number;
  money: string;
  currency: string;
}
interface FinishOrderParams {
  transactionId: string;
  channel: number;
  receipt: string;
  signature: string;
  exInfo: string;
}
/*  let resJson = window.JsToNative.fbShare(JSON.stringify({url}));
    let data: fbShareRes = JSON.parse(resJson);
    let result: {code: number; error_msg: string};
    if (data.code === 200) {
      result = {code: 200, error_msg: 'success'};
    } else if (data.code === 400) {
      result = data;
    } else {
      result = {code: 401, error_msg: 'user cancle'};
    }
    return Promise.resolve(result); */
