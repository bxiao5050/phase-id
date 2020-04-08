import Base from '../base';
import QuickApi from '../../api/quick';
import {loadJsRepeat, formatDate, getUrlOrigin} from '../../utils';

export default class QuickSdk extends Base {
  type: 5;
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
    this.initConfig(config);
  }
  init() {}
}

class Quick {
  initQuickJsSdk() {
    return loadJsRepeat({
      url: 'https://sdkapi02.quicksdk.net/static/lib/libQuickSDK_v2.js',
      id: 'rg_quick'
    });
  }
  async init(productCode: string, productKey: string) {
    await this.initQuickJsSdk();
    return new Promise(resolve => {
      QuickSDK.init(productCode, productKey, true, function() {
        // quick 初始化成功
        resolve();
      });
    });
  }
  login() {
    return new Promise((resolve, reject) => {
      QuickSDK.login(function(callbackData) {
        if (callbackData.status) {
          resolve(callbackData.data);
        } else {
          reject(callbackData.message);
        }
      });
    });
  }
  logout() {
    return new Promise(resolve => {
      QuickSDK.logout(function() {
        console.log('退出游戏');
        resolve();
      });
    });
  }
  pay(params: QuickPayParams) {
    const payJson = JSON.stringify(params);
    return new Promise(resolve => {
      QuickSDK.pay(payJson, function(response) {
        resolve();
        console.log(response);
      });
    });
  }
  uploadGameRoleInfo(params: QuickUploadGameRoleInfoParams) {
    const roleInfoJson = JSON.stringify(params);
    return new Promise(resolve => {
      QuickSDK.uploadGameRoleInfo(roleInfoJson, function(response) {
        resolve();
        console.log(response);
      });
    });
  }
  /* 一些渠道的切换账户的需求,在此回调内无需调用登录接口 */
  setSwitchAccountNotification() { }
  setLogoutNotification(){}
}
/* 文档 https://www.quicksdk.com/doc-762.html */
declare global {
  const QuickSDK: {
    /* 初始化 */
    init: (productCode: string, productKey: string, otherParam: true, callback: () => void) => void;
    /* 登录 */
    login: (callback: (callbackData: QuickLoginRes) => void) => void;
    /* 切换账号功能,切换成功的回调 */
    setSwitchAccountNotification: (callback: (callbackData: QuickLoginRes) => void) => void;
    /* 支付 */
    pay: (orderInfoJson: string, callback: (payStatusObject: any) => void) => void;
    /* 上传角色信息 */
    uploadGameRoleInfo: (roleInfoJson: string, callback: (params: any) => void) => void;
    /* 退出游戏 */
    logout: (callback: (logoutObject: any) => void) => void;
    /* 注册退出游戏回调 */
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
  vipLevel: number;
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
  serverId: number;
  /* 角色所在区服 */
  userServer: string;
  /* 角色等级 */
  userLevel: number;
  /* 游戏内的订单,服务器通知中会回传 */
  cpOrderNo: string;
  /* 购买金额（元） */
  amount: string;
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
