import Base, {GamePayParams} from '../base';
import QuickApi from '../../api/quick';
import {loadJsRepeat, formatDate, getUrlOrigin} from '../../utils';
import {fbShare} from '../../utils/fb';
import {initRG, BindZoneParam} from '../rg';

// quick sdk 不需要界面
export default class QuickSdk extends Base {
  type: 6 = 6;
  private quickUserInfo: QuickLoginRes['data'];
  /* quick 平台需要的后端接口 */
  private quickApi = new QuickApi();
  private quick = new Quick();
  devicePromise = Promise.resolve({
    source: 3,
    network: 0,
    model: '0',
    operatorOs: '0',
    deviceNo: '0',
    device: '0',
    version: '0'
  });
  constructor(config: ExtendedConfig) {
    super();
    super.init(config);
    this.quickApi.setAppSecret(config.appSecret);
    delete config.appSecret;
    initRG(this);
  }
  async init() {
    /* 初始化 quick sdk */
    await this.quick.init(this.config.productCode, this.config.productKey);
    /* 注册 注销账号的回调 */
    QuickSDK.setLogoutNotification(function (logoutObject: any) {
      console.log('Game:玩家点击注销帐号', logoutObject);
    });
    var that = this;
    QuickSDK.setSwitchAccountNotification(async function (callbackData: QuickLoginRes) {
      console.log('玩家切换账号,重新登录', callbackData);
      // await RG.ChangeAccount();
      // that.quickLoginHandle(callbackData.data);
    });
    /* quick 登录,取消后会再次拉起登录界面 */
    const loginRes = await this.quick.login();
    this.quickLoginHandle(loginRes);
  }
  async quickLoginHandle(loginRes: QuickLoginRes['data']) {
    const {appId, advChannel} = this.config.urlParams;
    /* quick token 校验 */
    const verifyRes = await this.quickApi.verifyToken({
      appId,
      advChannel,
      uid: loginRes.uid,
      token: loginRes.token,
      sign: ''
    });
    /* 校验成功后进行平台登录 */
    if (verifyRes && verifyRes.code === 200) {
      this.quickUserInfo = loginRes;
      const userName = 'Quick-' + loginRes.uid;
      const password = CryptoJS.MD5(userName).toString();
      this.platformRegister({
        userName,
        password,
        accountType: 3,
        userChannel: 5,
        nickName: loginRes.username
      })
        .then(res => {
          if (res.code === 200) {
            window.rgAsyncInit();
          } else {
            alert(res.error_msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  async bindZone(params: BindZoneParam) {
    /* 服务端获取用户信息 */
    const roleInfoRes = await this.quickApi.getRoleInfo({
      appId: this.config.urlParams.appId,
      userId: this.account.user.userId,
      gameZoneId: params.gameZoneId
    });
    /* 成功 */
    if (roleInfoRes.code === 200) {
      const {gameZoneId, roleId, level, createRole} = params;
      const {createTime, roleName, vipLevel} = roleInfoRes.data[0];
      const roleCreateTime = new Date(createTime).getTime();
      const {uid} = this.quickUserInfo;
      /* 更新quick平台用户信息 */
      await this.quick.uploadGameRoleInfo({
        isCreateRole: Boolean(createRole),
        roleCreateTime,
        uid,
        username: this.quickUserInfo.username,
        serverId: gameZoneId,
        serverName: '' + gameZoneId,
        userRoleName: '' + roleId,
        userRoleId: roleId,
        userRoleBalance: 1,
        vipLevel: vipLevel,
        userRoleLevel: +level,
        partyId: 1,
        partyName: '行会名称',
        gameRoleGender: '男',
        gameRolePower: '100',
        partyRoleId: 1,
        partyRoleName: '会长',
        professionId: '',
        profession: '',
        friendlist: ''
      });
      /* 绑定自己平台用户信息 */
      return super.bindZone(params);
    }
    // 失败
    else {
      alert(roleInfoRes.error_msg);
    }
  }
  async pay(params: GamePayParams) {
    // 1. 获取支付信息
    const pamentInfoRes = await this.getPaymentInfo(params);
    if (pamentInfoRes.code === 200) {
      // 2. 平台创建订单
      const orderRes = await this.createOrder(pamentInfoRes.payments[0]);
      if (orderRes.code === 200) {
        // 3. 调用quick支付
        const {gameZoneId, roleId, roleName, level} = params;
        const {
          money,
          currency,
          transactionId,
          count,
          quantifier,
          productDesc,
          productId
        } = orderRes.data as PayRes;
        this.quick.pay({
          productCode: this.config.productCode,
          uid: this.quickUserInfo.uid,
          username: this.quickUserInfo.username,
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
        });
      } else {
        console.error('createOrder error: ' + orderRes.error_msg);
      }
    } else {
      console.error('getPaymentInfo error: ' + pamentInfoRes.error_msg);
    }
  }
  mark(markName: string, params: any) {
    /* quick 平台暂时不打点 */
    console.log('markName: ' + markName, +'params', params);
  }
  openFansPage() {
    /* 打开粉丝页 */
    window.open(this.config.fans);
  }
  fbShare = fbShare;
}

class Quick {
  // static _ins: Quick;
  // static get ins() {
  //   return Quick._ins || new Quick();
  // }
  // constructor() {
  //   Quick._ins = this;
  // }
  initQuickJsSdk() {
    return loadJsRepeat({
      url: 'https://sdkapi02.quicksdk.net/static/lib/libQuickSDK_v2.js',
      id: 'rg_quick'
    });
  }
  async init(productCode: string, productKey: string): Promise<void> {
    await this.initQuickJsSdk();
    return new Promise(resolve => {
      QuickSDK.init(productCode, productKey, true, function () {
        // quick 初始化成功
        resolve();
      });
    });
  }
  loginResolve: (params: QuickLoginRes['data']) => void;
  loginPromise: Promise<QuickLoginRes['data']> = new Promise(
    resolve => (this.loginResolve = resolve)
  );
  login() {
    var that = this;
    QuickSDK.login(function (callbackData) {
      if (callbackData.status) {
        that.loginResolve(callbackData.data);
      } else {
        if (callbackData.message === 'cancel') {
          that.login();
        } else {
          console.log(callbackData.message);
        }
      }
    });
    return this.loginPromise;
  }
  logout(): Promise<any> {
    return new Promise(resolve => {
      QuickSDK.logout(function (res) {
        console.log('退出游戏');
        resolve(res);
      });
    });
  }
  pay(params: QuickPayParams): Promise<any> {
    const payJson = JSON.stringify(params);
    return new Promise(resolve => {
      QuickSDK.pay(payJson, function (payStatusObject) {
        resolve(payStatusObject);
        console.log('GameDemo:下单通知' + JSON.stringify(payStatusObject));
      });
    });
  }
  uploadGameRoleInfo(params: QuickUploadGameRoleInfoParams): Promise<any> {
    const roleInfoJson = JSON.stringify(params);
    return new Promise(resolve => {
      QuickSDK.uploadGameRoleInfo(roleInfoJson, function (res) {
        resolve(res);
        console.log(res);
      });
    });
  }
  /* 一些渠道的切换账户的需求,在此回调内无需调用登录接口 */
}
/* 文档 https://www.quicksdk.com/doc-762.html */
declare global {
  const QuickSDK: {
    /* 初始化 */
    init: (productCode: string, productKey: string, otherParam: true, callback: () => void) => void;
    /* 登录 */
    login: (callback: (callbackData: QuickLoginRes) => void) => void;
    /* 切换账号功能,切换成功的回调, 一些渠道的切换账户的需求,在此回调内无需调用登录接口 */
    setSwitchAccountNotification: (callback: (callbackData: QuickLoginRes) => void) => void;
    /* 支付 */
    /* 支付后,部分渠道可触发回调函数,函数中可获取是否支付成功,
    但需要注意,此结果仅仅作为UI展示(或完全不用),发货应以服务器通知为准.
    回调函数payStatusObject对象中status为true时为支付成功.
    */
    pay: (orderInfoJson: string, callback: (payStatusObject: any) => void) => void;
    /* 上传角色信息 */
    uploadGameRoleInfo: (roleInfoJson: string, callback: (params: any) => void) => void;
    /* 退出游戏 */
    logout: (callback: (logoutObject: any) => void) => void;
    /* 注册退出游戏回调,玩家点击注销帐号 */
    setLogoutNotification: (callback: (logoutObject: any) => void) => void;
  };
}
interface QuickLoginRes {
  status: boolean;
  data: {
    uid: string;
    username: string;
    token: string;
    isLogin: boolean;
    channelId: string;
  };
  message: string;
}
interface QuickUploadGameRoleInfoParams {
  /* 仅创建角色时传true,更新信息时传false */
  isCreateRole: boolean;
  /* 角色创建时间 */
  roleCreateTime: number;
  /* UID */
  uid: string;
  /* username */
  username: string;
  /* 区服ID */
  serverId: string;
  /* 区服名称 */
  serverName: string;
  /* 游戏角色名 */
  userRoleName: string;
  /* 游戏内角色ID */
  userRoleId: string;
  /* 角色游戏内货币余额 */
  userRoleBalance: number;
  /* 角色VIP等级 */
  vipLevel: string;
  /* 角色等级 */
  userRoleLevel: number;
  /* 公会/社团ID */
  partyId: number;
  /* 公会/社团名称 */
  partyName: string;
  /* 角色性别 */
  gameRoleGender?: string;
  /* 角色战力 */
  gameRolePower?: string;
  /* 角色在帮派中的ID */
  partyRoleId?: number;
  /* 角色在帮派中的名称 */
  partyRoleName?: string;
  /* 角色职业ID */
  professionId?: string;
  /* 角色职业名称 */
  profession?: string;
  /* 角色好友列表 */
  friendlist?: string;
}
/* 选传的字段值可以为空,但是对象必须包含此属性. */
interface QuickPayParams {
  /* QuickSDK后台自动分配的参数 */
  productCode: string;
  /* 渠道UID */
  uid: string;
  /* 渠道username */
  username: string;
  /* 游戏内角色ID */
  userRoleId: string;
  /* 游戏角色名 */
  userRoleName: string;
  /* 区服 id  */
  serverId: string;
  /* 角色所在区服 */
  userServer: string;
  /* 角色等级 */
  userLevel: number;
  /* 游戏内的订单,服务器通知中会回传 */
  cpOrderNo: string;
  /* 购买金额（元） */
  amount: number;
  /* 购买商品个数 */
  count: number;
  /*  购买商品单位，如，个 */
  quantifier: string;
  /* 道具名称 */
  subject: string;
  /* 道具描述 */
  desc: string;
  /* 服务器通知地址 */
  callbackUrl?: string;
  /* 透传参数,服务器通知中原样回传 */
  extrasParams: string;
  /* 商品ID */
  goodsId: string;
}
interface PayRes {
  money: number;
  currency: string;
  transactionId: string;
  count: number;
  quantifier: string;
  productDesc: string;
  productId: string;
}
