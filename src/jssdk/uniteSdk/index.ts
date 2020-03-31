// import { Ins } from 'DOM/BTgame';
import Http from 'Src/jssdk/base/Http';
import {getRoleInfo, Api} from 'Src/jssdk/base/Api';
import {getPaymentConfig, createOrder} from 'Src/jssdk/base/payment';

import {signed, formatDate} from '../common/utils';

export default class UniteSdk {
  private _user: UserInfo;
  private quickUserInfo: {
    uid: string;
    username: string;
    token: string;
    isLogin: boolean;
    channelId: string;
  };
  config: JSSDK.Config;
  reactPromise: any;
  reactDomPromise: any;
  quickSdkPromise: any;
  deviceMsg: {
    source: number;
    network: number;
    model: string;
    operatorOs: string;
    deviceNo: string;
    device: string;
    version: string;
  };
  constructor(config: any) {
    this.reactPromise = this.loadScript(reactSrc);
    this.reactDomPromise = this.loadScript(reactDomSrc).then(() => {
      import('DOM/BTgame').then(res => {
        window.RG.jssdk.App = res.Ins;
      });
    });
    this.config = config;
    let rg = function() {};
    rg.prototype.jssdk = this;
    window.RG = new rg();
    console.log('this.ExposeApis() before');
    this.ExposeApis();
    this.deviceMsg = this.getDeviceMsg();
    this.quickSdkPromise = this.loadScript(
      'https://sdkapi02.quicksdk.net/static/lib/libQuickSDK_v2.js'
    );
  }
  init() {
    this.quickInit().then(() => {
      let userRes: QuickLoginRes;
      try {
        let userResStr = localStorage.getItem('_rg_quick_loginRes');
        userRes = JSON.parse(userResStr);
      } catch (e) {
        console.log(e);
      }
      if (userRes) {
        this.quickUserInfo = userRes.data;
        const {uid, username, token, isLogin, channelId} = userRes.data;
        this.Login(uid, username, token, isLogin, channelId);
      } else {
        this.quickLogin().then((res: QuickLoginRes) => {
          this.quickUserInfo = res.data;
          const {uid, username, token, isLogin, channelId} = this.quickUserInfo;
          this.Login(uid, username, token, isLogin, channelId);
        });
      }
    });
  }
  quickInit() {
    return new Promise((resolve, reject) => {
      this.quickSdkPromise.then(() => {
        const {productCode, productKey} = this.config;
        QuickSDK.init(productCode, productKey, true, function() {
          QuickSDK.setSwitchAccountNotification(function(callbackData: QuickLoginRes) {
            try {
              let userInfoStr = JSON.stringify(callbackData);
              localStorage.setItem('_rg_quick_loginRes', userInfoStr);
            } catch (e) {
              console.log(e);
              // location.reload();
            }
          });
          QuickSDK.setLogoutNotification(function(logoutObject: any) {
            console.log('Game:玩家点击注销帐号', logoutObject);
            // location.reload();
          });
          resolve();
        });
      });
    });
  }
  quickLogin() {
    return new Promise((resolve, reject) => {
      const that = this;
      QuickSDK.login(async (callbackData: QuickLoginRes) => {
        if (callbackData.status) {
          console.log('GameDemo:QuickSDK登录成功: uid=>' + callbackData.data.uid);
          const {appId, advChannel} = this.config.urlParams;
          const {token, uid} = callbackData.data;
          const isLoginSuccess = await this.quickVerifyToken(appId, advChannel, uid, token);
          if (isLoginSuccess) {
            resolve(callbackData);
          } else {
            this.showNotice(this.config.i18n.UnknownErr);
          }
        } else {
          console.log('GameDemo:QuickSDK登录失败:' + JSON.stringify(callbackData));
          if (callbackData.message === 'cancel') {
            that.quickLogin();
          }
        }
      });
    });
  }
  quickPay(paymentConfig: PaymentConfig, payRes: PayRes) {
    const {gameZoneId, roleId, roleName, level} = paymentConfig;
    const {money, currency, transactionId, count, quantifier, productDesc, productId} = payRes;
    const orderInfo = {
      productCode: this.config.productCode,
      uid: this.quickUserInfo.uid,
      userRoleId: roleId,
      userRoleName: roleName,
      serverId: gameZoneId,
      userServer: `${gameZoneId}`,
      userLevel: level,
      cpOrderNo: transactionId,
      amount: money,
      subject: productDesc,
      desc: productDesc,
      goodsId: productId,
      count: count,
      quantifier: quantifier,
      callbackUrl: '',
      extrasParams: ''
    };
    const orderInfoJson = JSON.stringify(orderInfo);
    QuickSDK.pay(orderInfoJson, function(payStatusObject) {
      console.log('GameDemo:下单通知' + JSON.stringify(payStatusObject));
    });
  }
  quickBindZone(userInfo: BindZoneParam, roleCreateTime: number) {
    const {userId, gameZoneId, createRole, roleId, level} = userInfo;
    const {uid} = this.quickUserInfo;
    const roleInfo = {
      isCreateRole: true,
      roleCreateTime,
      uid,
      serverId: gameZoneId,
      serverName: '' + gameZoneId,
      userRoleName: '' + roleId,
      userRoleId: roleId,
      userRoleBalance: 1,
      vipLevel: 1,
      userRoleLevel: level,
      partyId: 1,
      partyName: '行会名称',
      gameRoleGender: '男',
      gameRolePower: 100,
      partyRoleId: 1,
      partyRoleName: '会长',
      professionId: '',
      profession: '',
      friendlist: ''
    };
    const roleInfoJson = JSON.stringify(roleInfo);
    QuickSDK.uploadGameRoleInfo(roleInfoJson, function(response) {
      console.log(response);
    });
  }
  async quickVerifyToken(appId: string, advChannel: string, uid: string, token: string) {
    // Sign=MD5(appId+uid+token+appSecret)
    const sign = signed([appId, uid, token, this.config.appSecret]);
    // const route = `/pocketgames/client/quick/verifyToken/{appId}/{advChannel}/{uid}/{token}/{sign}`;
    const route = `/quick/verifyToken/${appId}/${advChannel}/${encodeURIComponent(
      uid
    )}/${encodeURIComponent(token)}/${encodeURIComponent(sign)}`;
    const result = await Http.ins
      .get({route})
      .then((res: LoginRes) => {
        if (res.code === 200) {
          return true;
        }
        return false;
      })
      .catch(err => {
        console.log('quickVerifyToken::::' + err);
        return false;
      });
    return result;
  }
  async showNotice(msg: string) {
    await this.reactPromise;
    await this.reactDomPromise;
    RG.jssdk.App && RG.jssdk.App.showNotice(msg);
  }
  CurUserInfo = (): JSSDK.CurUserInfo => {
    const {userId, userName, token} = this._user;
    return {userId, userName, token};
  };
  // 第三方登录，全部走注册接口
  async Login(uid: string, username: string, token: string, isLogin: boolean, channelId: string) {
    const {appId, advChannel, sdkVersion} = this.config.urlParams;
    const {source, network, device, deviceNo, model, version, operatorOs} = this.deviceMsg;
    const userName = 'Quick-' + uid;
    const password = md5(userName);
    const data = {
      appId,
      advChannel,
      userName,
      password,

      nickName: username,
      accountType: this.config.accountType,
      thirdPartyId: '',
      sex: '',
      birthday: '',
      email: '',
      telephone: '',
      /* 0=默认渠道 1=appota 2=mwork 5=quick */
      userChannel: this.config.userChannel,

      source,
      network,
      model,
      operatorOs,
      deviceNo,
      device,
      version,
      sdkVersion,
      exInfo: JSON.stringify({uid, username, isLogin, channelId}),
      /* appId+userName+password+source+appKey */
      sign: signed([appId, userName, password, source, this.config.app_key])
    };
    await Http.ins
      .post({route: '/user/v3/register', data})
      .then((res: LoginRes) => {
        if (res.code === 200) {
          this._user = Object.assign(res.data, {
            password: data.password,
            token: res.token
          });
          window.rgAsyncInit();
        } else if (res.code == 102) {
          this.showNotice(RG.jssdk.config.i18n.code102);
        } else if (res.code == 101) {
          this.showNotice(RG.jssdk.config.i18n.code101);
        } else {
          this.showNotice(res.error_msg);
        }
      })
      .catch(err => {
        this.showNotice(err);
      });
  }
  /* RG.BindZone */
  BindZone(BindZoneParam: BindZoneParam) {
    const {userId, gameZoneId} = BindZoneParam;
    getRoleInfo({
      appId: this.config.urlParams.appId,
      userId,
      gameZoneId,
      appSecret: this.config.appSecret
    }).then((res: {code: number; error_msg: string; data: GameRoleInfo[]}) => {
      if (res.code === 200) {
        this.quickBindZone(BindZoneParam, new Date(res.data[0].createTime).getTime());
      }
    });
    return Api.instance.Bind(BindZoneParam);
  }
  /* RG.Share */
  Share(shareUrl: string) {
    console.info('facebook share' + shareUrl);
    return new Promise((resolve, reject) => {
      FB.ui(
        {
          method: 'share',
          href: shareUrl,
          display: 'popup'
        },
        function(shareDialogResponse) {
          if (shareDialogResponse) {
            if (shareDialogResponse.error_message) {
              resolve({
                code: 0,
                error_msg: shareDialogResponse.error_message
              });
            } else {
              resolve({
                code: 200
              });
            }
          } else {
            resolve({
              code: 0
            });
          }
        }
      );
    });
  }
  Mark(markName) {
    console.log(markName);
  }
  /* 创建订单,congpaymentInfo中获取信息 */
  getPayInfo(paymentConfig: PaymentConfig) {
    return getPaymentConfig(paymentConfig).then(res => {
      if (res.code === 200) {
        const params = Object.assign({},res.payments[0],res.payments[0].selectedProduct)
        return createOrder(paymentConfig,params).then(res=>{
          if(res.code === 200){
            this.quickPay(paymentConfig, res.data as any);
          }
        })
      }
    });
  }
  async Pay(paymentConfig: PaymentConfig) {
    console.log(paymentConfig);
    const {source, network, device, deviceNo, model, version, operatorOs} = this.deviceMsg;
    const {appId, advChannel, sdkVersion} = this.config.urlParams;
    const {code, channel} = this.config;
    const {userId, gameOrderId, gameZoneId, gameCoin, roleId, roleName, level} = paymentConfig;
    const exInfo = JSON.stringify({gameCoin: gameCoin});
    const data = {
      appId,
      advChannel,
      channel,
      code,
      userId: RG.jssdk.CurUserInfo().userId,
      gameOrderId,
      gameZoneId,
      roleId,
      roleName,
      level,
      source,
      deviceNo,
      device,
      network,
      model,
      operatorOs,
      version,
      sdkVersion,
      clientTime: formatDate(),
      itemType: 0,
      exInfo,
      amount: null,
      currency: null,
      productName: null,
      isOfficial: 0,
      sign: signed([
        appId,
        advChannel,
        RG.jssdk.CurUserInfo().userId,
        roleId,
        gameOrderId,
        gameZoneId,
        code,
        source,
        channel,
        'null',
        'null',
        'null',
        exInfo,
        this.config.app_key
      ])
    };
    console.log('createOrder', data);
    // createOrder(data).then(res=>{

    // })
    Http.ins
      .post({route: '/order/create/v4.0', data})
      .then((orderRes: {code: number; error_msg: string; data: PayRes}) => {
        if (orderRes.code !== 200) {
          console.error('​Payment -> createOrder -> orderRes', orderRes);
        } else {
          this.quickPay(paymentConfig, orderRes.data);
        }
      });
  }
  getDeviceMsg() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    var source = isAndroid ? 1 : isiOS ? 0 : 3;
    return {
      source: source,
      network: 0,
      model: '0',
      operatorOs: '0',
      deviceNo: '0',
      device: '0',
      version: '0'
    };
  }
  initIosGetDeviceMsgAsync() {
    const WK = window['webkit'];
    window.JsToNative = {
      getDeviceMsgAsync: function() {
        if (!RG.jssdk.deviceMsgPromise) {
          RG.jssdk.deviceMsgPromise = new Promise(resolve => {
            RG.jssdk.deviceMsgResolve = resolve;
          });
          WK.messageHandlers.getDeviceMsg.postMessage(null);
        }
        return RG.jssdk.deviceMsgPromise;
      },
      init: function(param: string) {
        WK.messageHandlers.init.postMessage(param);
      },
      gameEvent: function(param: string) {
        console.log('gameEvent', param);
        WK.messageHandlers.gameEvent.postMessage(param);
      },
      jpwork: function(param: string) {
        WK.messageHandlers.jpwork.postMessage(param);
      },
      consumeOrder: function(param: string) {
        WK.messageHandlers.consumeOrder.postMessage(param);
      },
      exitApp: function() {
        WK.messageHandlers.exitApp.postMessage(null);
      }
    } as any;
  }
  /* 退出 */
  goBack() {
    if (confirm(RG.jssdk.config.i18n.tuichu)) {
      JsToNative.exitApp();
    }
  }
  /* 获取设备信息 */
  gotDeviceMsg(deviceMsg: string) {
    let data;
    try {
      data = JSON.parse(deviceMsg);
    } catch (e) {
      console.log(e);
      data = {};
    }

    RG.jssdk.deviceMsgResolve(data);
    RG.jssdk.deviceMsgPromise = null;
  }
  /* 重新加载页面 */
  Redirect() {
    window.name = 'redirect';
    location.reload();
  }
  /* 给RG上挂载方法 */
  ExposeApis() {
    let exposeApis = ['Redirect', 'CurUserInfo', 'BindZone', 'Share', 'Pay', 'Mark'];
    exposeApis.forEach(api => {
      window.RG[api] = this[api].bind(this);
    });
  }
  /* 加载js */
  loadScript(src) {
    let resolve,
      script = document.createElement('script');
    script.src = src;
    script.onload = function() {
      resolve();
    };
    document.head.appendChild(script);
    return new Promise(function(_) {
      resolve = _;
    });
  }
}

interface QuickLoginRes {
  status: boolean;
  data: {
    uid: string;
    username: string;
    token: string;
    isLogin: boolean;
    channelId: string;
    message: string;
  };
  message?: string;
}

interface PayRes {
  money: number;
  currency: string;
  transactionId: string;
  count: string;
  quantifier: string;
  productDesc: string;
  productId: string;
}

interface GameRoleInfo {
  roleId: string;
  roleName: string;
  roleLevel: string;
  state: number;
  createTime: string;
  lastLoginTime: string;
  vipLevel: string;
  gameCoinTotal: string;
}
