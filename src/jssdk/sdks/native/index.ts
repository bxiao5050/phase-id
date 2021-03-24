import 'crypto-js/aes';
import Base from '../base';
import IosApi from './ios';
import AndroidApi from './android';
import Init from '../../api/init';
import {formatDate} from '../../utils';
import { initRG } from '../rg';

/* 引入类型 */
import {ConsumeOrderParams, FbLoginRes, FbShareRes, DeviceMsg, GameEventParam} from './android';
import {GamePayParams} from '../base';
import {InitConfigParams} from '../../api/init';
import {PaymentChannel} from '../../api/payment';
import App from 'Src/jssdk/view2/App';

export default class NativeSdk extends Base {
  type: 1 = 1;
  native: IosApi | AndroidApi;
  app: App;
  initApi = new Init();

  constructor(config: ExtendedConfig) {
    super();
    this.initApi.setAppKey(config.appKey);
    super.init(config);
    this.initNative();
    this.initNativeToJs();
    initRG(this);
    /* sdk 加载完成 */
    RG.Mark('sdk_loaded');
    this.init();
  }
  get devicePromise() {
    return this.native.getDeviceMsg();
  }
  async init() {
    /* 微端初始化 */
    this.getNativeInitConfig();
    // 挂载 dom
    const {Ins} = await import("../../view2/index")
    this.app = Ins;
    /* 判断是否自动登录,切换账号, 还是 fbLogin*/
    const user = this.account.user;
    /* facebook 跳出登录重定向后的参数 */
    const code = this.config.urlParams.code;
    /* 在跳出登录时设置,在登录完成保存 user 时删除 */
    let isFbLogin = localStorage.getItem('rg_isFaceLogin');
    /* 如果是切换账号,就什么都不做 */
    if (window.name === 'redirect') {
      window.name = '';
      // 显示登录界面
      this.app.showLogin();
    } else if (code && isFbLogin) {
      /* 如果是 fb 登录就走fb登录 */
      await this.fbLogin(false);
      /* 加载 loading 界面 */
      const loginModule = this.app.showLogin();
      loginModule.loginComplete();
    } else {
      /* 如果有用户,就自动登录 */
      if (user) {
        await this.platformLogin(user.userName, user.password);
        /* 加载 loading 界面 */
        const loginModule = this.app.showLogin();
        loginModule.loginComplete();
      } else {
        /* 如果用户不存在,查看users中有用户信息吗,如果有使用第一个,如果没有显示登录页 */
        let userIdArr = Object.keys(this.account.users);
        if (userIdArr.length) {
          let user = this.account.users[userIdArr[0]];
          await this.platformLogin(user.userName, user.password);
          /* 加载 loading 界面 */
          const loginModule = this.app.showLogin();
          loginModule.loginComplete();
        } else {
          // 显示登录界面
          this.app.showLogin();
        }
      }
    }
  }
  isClick = false;
  async pay(params: GamePayParams) {
    return this.getPaymentInfo(params).then(async res => {
      if (res.payments.length) {
        /* 当只有一种支付方式的时候,并且不显示商品列表界面,并且showMethod 是3, channel是 0=苹果支付,1=google支付的时候,不再拉起支付界面,直接下单拉起sdk */
        if (
          res.payments.length === 1 &&
          res.payments[0].showProductList !== 1 &&
          res.payments[0].showMethod === 3 &&
          (res.payments[0].channel === 0 || res.payments[0].channel === 1)
        ) {
          /* 1.5秒之后可以继续下单 */
          if (this.isClick) return;
          this.isClick = true;
          setTimeout(() => {
            this.isClick = false;
          }, 1500);
          await this.order(res.payments[0]);
        } else {
          RG.jssdk.app.showPayment(res);
        }
      } else {
        RG.jssdk.app.showPrompt(
          RG.jssdk.config.i18n.txt_warn,
          RG.jssdk.config.i18n.txt_pay_not_open,
          true
        );
      }
    });
  }
  getConfigIsSuccess = false;
  getConfigResolve = null;
  getConfigPromise: Promise<void> = new Promise(resolve => {
    this.getConfigResolve = resolve;
  });
  async getNativeInitConfig() {
    if (!this.getConfigIsSuccess) {
      const deviceMsg = await this.devicePromise;
      const {appId, advChannel} = this.config.urlParams;
      let data: InitConfigParams = {
        appId: +appId,
        advChannel: +advChannel,
        source: deviceMsg.source,
        network: deviceMsg.network,
        model: deviceMsg.model,
        operatorOs: deviceMsg.operatorOs,
        deviceNo: deviceMsg.deviceNo,
        device: deviceMsg.device,
        version: deviceMsg.version,
        sdkVersion: this.sdkVersion,
        clientTime: formatDate(),
        firstInstall: 0,
        sign: ''
      };
      return this.initApi
        .getConfig(data)
        .then(res => {
          if (res.popUpSwitch === '1') {
            this.config.popUpSwitch = true;
            this.config.popUpInterval = +res.popUpInterval;
            this.config.firstPopUpInterval = +res.firstPopUpInterval || 0;
            // 测试使用
            // this.config.popUpInterval = 5;
            // this.config.firstPopUpInterval = 30;
          }
          this.config.fans = res.fbUrl;
          this.config.bindVisitorGiftUrl = res.rewardUrl;

          delete res.popUpSwitch;
          delete res.popUpInterval;
          delete res.firstPopUpInterval;
          delete res.fbUrl;
          delete res.rewardUrl;

          this.native.init(res);
          this.getConfigIsSuccess = true;
          this.getConfigResolve();
        })
        .catch(e => {
          console.log('init err', e);
        });
    }
  }
  async mark(markName: string, params?: {money: string; currency: string}) {
    await this.getConfigPromise;
    let eventName: string = markName;
    // 传递给原生的参数
    let markParmas: GameEventParam = {
      eventName
    };
    if (this.account.user) markParmas.userId = this.account.user.userId;
    // 获取adjust Token
    if (RG.jssdk.config.adjustToken && RG.jssdk.config.adjustToken[eventName]) {
      markParmas.eventToken = RG.jssdk.config.adjustToken[eventName];
    }
    // sdk_purchased_done，原生端根据此字符串来做是否支付的判断,adjust只需要token，不要调整代码的顺序，最后匹配购买的点名
    if (eventName === 'sdk_purchased_done') {
      markParmas.currency = (params && params.currency) || '';
      markParmas.money = (params && params.money) || '';
    }
    // 匹配唯一点,有的话就打唯一点,facebook不打唯一点
    if (RG.jssdk.config.adjustToken && RG.jssdk.config.adjustToken[eventName + '_unique']) {
      const name = eventName + '_unique';
      const eventToken = RG.jssdk.config.adjustToken[name];
      let uniqueMarkParams = {
        eventName: name,
        eventToken,
        money: markParmas.money,
        currency: markParmas.currency,
        userId: markParmas.userId
      };
      this.native.gameEvent(uniqueMarkParams);
      console.log(`"${eventName + '_unique'}" has marked - native`, uniqueMarkParams);
    }
    // // 打点、输出日志
    this.native.gameEvent(markParmas);
    console.info(`"${markParmas.eventName}" has marked - native`, markParmas);
  }
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

  async fbLogin(isLogout: boolean) {
    let fbUserInfo: FbLoginRes = await this.native.fbLogin();
    if (fbUserInfo) {
      return this.platformRegister(fbUserInfo);
    } else {
      console.error('fbLogin error');
      return Promise.reject();
    }
  }
  /* facebook 分享 */
  fbShare(url: string) {
    return this.native.fbShare(url);
  }
  /* 打开粉丝页 */
  openFansPage() {
    window.open(this.config.fans);
  }
  /* 初始化 对应的手机平台 */
  initNative() {
    if (window.webkit) {
      this.native = new IosApi();
    } else {
      this.native = new AndroidApi();
    }
  }
  /* 挂载方法到 window.NativeToJs 上 ios传的参数都是对象,android 传的参数是 json*/
  initNativeToJs() {
    const that = this;
    window.NativeToJs = {
      consumeOrder: function (params: string | FinishOrderParams) {
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
                exInfo: data.exInfo,
                money: res.money,
                currency: res.currency
              };
              if (RG.jssdk.config.isPurchasedMark) {
                RG.Mark('sdk_purchased_done', {
                  userId: +RG.CurUserInfo().userId,
                  money: res.money + '',
                  currency: res.currency
                });
              }
            } else {
              result = {
                code: res.code,
                error_msg: res.error_msg,
                exInfo: data.exInfo
              };
              that.app.showNotice(RG.jssdk.config.i18n.net_error_0);
            }
            that.native.consumeOrder(result);
            that.app.hidePayment();
          });
      },
      jpworkResult: function (params: string | JpworkResultParams) {
        console.log(' window.NativeToJs:: jpworkResult', params);
      },
      goBack: function () {
         console.log(' window.NativeToJs:: goBack');
         that.app
           .showPrompt(RG.jssdk.config.i18n.txt_warn, RG.jssdk.config.i18n.txt_exit_tip)
           .then(res => {
             if (res) {
              window.JsToNative.exitApp();
             }
           });
      },
      deviceMsg: function (params: string | DeviceMsg) {
        let result: DeviceMsg = params as DeviceMsg;
        if (typeof params === 'string') {
          result = JSON.parse(params);
        }
        if (!result) result = {} as any;
        (that.native as IosApi).deviceMsgResolve(result);
        (that.native as IosApi).deviceMsgPromise = null;
      },
      fbShareHandle: function (params: string | FbShareRes) {
        let data: FbShareRes = params as FbShareRes;
        if (typeof params === 'string') {
          data = JSON.parse(params);
        }
        let result: {code: number; error_msg?: string};
        if (data.code === 200) {
          result = {code: 200, error_msg: 'success'};
        } else if (data.code === 400) {
          result = data;
        } else {
          result = {code: 401, error_msg: 'user cancle'};
        }
        that.native.fbLoginResolve(result);
        that.native.fbSharePromise = null;
      },
      fbLoginHandle: function (params: string | FbLoginRes) {
         console.log(' window.NativeToJs:: fbLoginHandle', params);
         let result: FbLoginRes = params as FbLoginRes;
         if (typeof params === 'string') {
           result = JSON.parse(params);
         }
         localStorage.setItem('rg_fb_old_Info', result.mapping);
         result.userName = 'fb-' + result.userId;
         result.password = result.userId + 'oneFlower1WorldOneLeaf1Bodhi';
         result.accountType = 2;
         result.userChannel = 0;
         that.native.fbLoginResolve(result);
      }
    };
  }
}
/* 在 initNativeToJs 中向 window上挂载方法,以供微端调用 */
declare global {
  interface Window {
    NativeToJs?: {
      consumeOrder: (params: string | FinishOrderParams) => void;
      jpworkResult: (params: string | JpworkResultParams) => void;
      goBack: () => void;
      deviceMsg: (params: any) => void;
      fbShareHandle: (params: string | FbShareRes) => void;
      fbLoginHandle: (params: string | FbLoginRes) => void;
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
