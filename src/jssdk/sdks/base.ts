import AccountApi from '../api/accountApi';
import Login from '../api/login';
import Account from '../api/account';
import Payment, {PaymentChannel} from '../api/payment';
/* 引入参数类型 */
import {LoginParam, RegisterParams} from '../api/login';
import {PaymentConfigParams, FinishedOrderParams, CreateOrderParams} from '../api/payment';
import {
  BindZoneParams,
  BindVisitorParams,
  ChangePwdParams,
  OpeartorEmailParams
} from '../api/accountApi';
import {DeviceMsg} from './native/android';
import {BindZoneParam} from './rg';
import * as CryptoJS from 'crypto-js/core';
// 首先在window上挂载
window.CryptoJS = CryptoJS;
import 'crypto-js/md5';

export default abstract class Base {
  sdkVersion: string = VERSION;
  accountApi = new AccountApi();
  login = new Login();
  payment = new Payment();
  account = new Account();
  abstract get devicePromise(): Promise<DeviceMsg>;
  config: ExtendedConfig;
  init(config: ExtendedConfig) {
    this.config = config;
    /* 控制游客升级弹窗是否弹出 */
    this.config.popUpSwitch = false;
    const appKey = config.appKey;
    this.accountApi.setAppKey(appKey);
    this.login.setAppKey(appKey);
    this.payment.setAppKey(appKey);
  }
  async platformLogin(userName: string, pwd: string) {
    const {appId, advChannel} = this.config.urlParams;
    // 密码限制长度的6-20位,加密后为32位
    const password = pwd.length === 32 ? pwd : CryptoJS.MD5(pwd).toString();
    const _up = pwd.length === 32 ? this.account.user._up : pwd;
    const deviceMsg = await this.devicePromise;
    let exInfo = '';
    if (pwd.length === 32 && this.account.user.accountType === 2) {
      exInfo = localStorage.getItem('rg_fb_old_Info') || '[]';
    }
    let data: LoginParam = {
      appId: +appId,
      userName: userName,
      password: password,
      source: deviceMsg.source,
      advChannel: +advChannel,
      network: deviceMsg.network,
      model: deviceMsg.model,
      operatorOs: deviceMsg.operatorOs,
      deviceNo: deviceMsg.deviceNo,
      device: deviceMsg.device,
      version: deviceMsg.version,
      sdkVersion: this.sdkVersion,
      exInfo,
      sign: ''
    };
    return this.login.login(data).then(res => {
      if (res.code === 200) {
        let nickName = '';
        if (
          this.account.user &&
          this.account.user.userId === res.data.userId &&
          this.account.user.nickName
        ) {
          nickName = this.account.user.nickName;
        }
        this.account.user = Object.assign(res.data, {password, token: res.token, nickName, _up});
      }
      return res;
    });
  }
  async platformRegister(params: RegisterInfo) {
    const {appId, advChannel} = this.config.urlParams;
    const password = CryptoJS.MD5(params.password).toString();
    const deviceMsg = await this.devicePromise;
    let exInfo = params.exInfo || '';
    if (params.accountType === 2) {
      exInfo = localStorage.getItem('rg_fb_old_Info') || '[]';
    }
    let data: RegisterParams = {
      appId: +appId,
      userName: params.userName,
      password: password,
      source: deviceMsg.source,
      advChannel: +advChannel,
      network: deviceMsg.network,
      model: deviceMsg.model,
      operatorOs: deviceMsg.operatorOs,
      deviceNo: deviceMsg.deviceNo,
      device: deviceMsg.device,
      version: deviceMsg.version,
      sdkVersion: this.sdkVersion,
      exInfo,
      sign: '',
      nickName: params.nickName || '',
      accountType: params.accountType,
      /* web端使用 advertiseId 来做广告的区分*/
      thirdPartyId: this.config.urlParams.advertiseId || '',
      email: params.email || '',
      telephone: params.telephone || '',
      userChannel: params.userChannel
    };
    const _up = params.accountType === 2 || params.accountType === 11 ? '' : params.password;
    return this.login.register(data).then(res => {
      if (res.code === 200) {
        this.account.user = Object.assign(res.data, {
          password,
          _up,
          token: res.token,
          nickName: params.nickName
        });
        localStorage.removeItem('rg_isFaceLogin');
        if (res.data.firstLogin) {
          RG.Mark('sdk_register');
        }
      }
      return res;
    });
  }
  visitorRegister() {
    let password = Math.floor(Math.random() * Math.pow(10, 8)) + '';
    return this.platformRegister({userName: '', password, accountType: 0, userChannel: 0});
  }
  getPaymentHistoryList() {
    return this.payment.getPaymentHistory(this.config.urlParams.appId, this.account.user.userId);
  }
  gamePayInfo: GamePayParams;
  async getPaymentInfo(params: GamePayParams) {
    this.gamePayInfo = params;
    const {appId, advChannel} = this.config.urlParams;
    const deviceMsg = await this.devicePromise;
    let data: PaymentConfigParams = {
      appId: +appId,
      advChannel: +advChannel,
      userId: this.account.user.userId,
      roleId: params.roleId,
      source: deviceMsg.source,
      network: deviceMsg.network,
      level: params.level,
      version: deviceMsg.version,
      gameCoin: params.gameCoin,
      exInfo: '',
      sign: ''
    };
    return this.payment.getPaymentConfig(data);
  }
  /* 将选择的商品,替换到 selectProduct 上 */
  async createOrder(params: PaymentChannel) {
    const {appId, advChannel} = this.config.urlParams;
    const deviceMsg = await this.devicePromise;
    const {gameOrderId, gameZoneId, roleId, roleName, level} = this.gamePayInfo;
    const userId = this.account.user.userId;
    const {channel, code, isOfficial, exInfo} = params;
    const {amount, currency, productName, itemType} = params.selectedProduct;
    let data: CreateOrderParams = {
      appId: +appId,
      advChannel: +advChannel,
      userId,
      gameOrderId,
      gameZoneId,
      roleId,
      roleName,
      level,
      source: deviceMsg.source,
      channel,
      code,
      amount,
      currency,
      productName,
      isOfficial,
      deviceNo: deviceMsg.deviceNo,
      device: deviceMsg.device,
      network: deviceMsg.network,
      model: deviceMsg.model,
      operatorOs: deviceMsg.operatorOs,
      version: deviceMsg.version,
      sdkVersion: this.sdkVersion,
      clientTime: '',
      itemType,
      exInfo: exInfo || '',
      sign: ''
    };
    return this.payment.createOrder(data);
  }
  async finishOrder(finishOrderParams: FinishOrderParams) {
    const deviceMsg = await this.devicePromise;
    const {transactionId, channel, exInfo, receipt, signature} = finishOrderParams;
    let data: FinishedOrderParams = {
      transactionId,
      receipt,
      signature,
      channel,
      advChannel: +this.config.urlParams.advChannel,
      deviceNo: deviceMsg.deviceNo,
      device: deviceMsg.device,
      network: deviceMsg.network,
      model: deviceMsg.model,
      operatorOs: deviceMsg.operatorOs,
      version: deviceMsg.version,
      sdkVersion: this.sdkVersion,
      clientTime: '',
      exInfo: exInfo || '',
      sign: ''
    };
    return this.payment.finishOrder(data);
  }
  async bindZone(params: BindZoneParam) {
    const {gameZoneId, createRole, roleId, level} = params;
    const {appId, advChannel} = this.config.urlParams;
    const deviceMsg = await this.devicePromise;
    let data: BindZoneParams = {
      userId: this.account.user.userId,
      appId: +appId,
      gameZoneId,
      createRole,
      source: deviceMsg.source,
      advChannel: +advChannel,
      network: deviceMsg.network,
      model: deviceMsg.model,
      operatorOs: deviceMsg.operatorOs,
      deviceNo: deviceMsg.deviceNo,
      device: deviceMsg.device,
      roleId,
      level,
      version: deviceMsg.version,
      sdkVersion: this.sdkVersion,
      sign: ''
    };
    return this.accountApi.bindZone(data);
  }
  async bindVisitor(userName: string, password: string) {
    let md5Password = CryptoJS.MD5(password).toString();
    let data: BindVisitorParams = {
      appId: +this.config.urlParams.appId,
      userId: this.account.user.userId,
      userName,
      password: md5Password,
      email: '',
      sign: ''
    };
    return this.accountApi.bindVisitor(data).then(res => {
      if (res.code === 200) {
        this.account.user = Object.assign(this.account.user, {
          password: md5Password,
          userName,
          userType: 1,
          _up: password
        });
      }

      return res;
    });
  }
  async changePassword(oldpass: string, newpass: string) {
    let password = CryptoJS.MD5(oldpass).toString();
    let newPassword = CryptoJS.MD5(newpass).toString();
    let data: ChangePwdParams = {
      appId: +this.config.urlParams.appId,
      userId: this.account.user.userId,
      password,
      newPassword,
      sign: ''
    };
    return this.accountApi.changePassword(data).then(res => {
      if (res.code === 200) {
        this.account.user = Object.assign(this.account.user, {
          password: newPassword,
          _up: newpass
        });
      }
      return res;
    });
  }
  async verifyPassword(password: string) {
    password = CryptoJS.MD5(password).toString();
    return this.accountApi.verifyPassword(
      this.config.urlParams.appId,
      this.account.user.userId,
      password
    );
  }
  async forgetPassword(userName: string) {
    return this.accountApi.forgetPassword(this.config.urlParams.appId, userName);
  }
  async operatorEmail(email: string) {
    let data: OpeartorEmailParams = {
      appId: +this.config.urlParams.appId,
      userId: this.account.user.userId,
      email,
      operatorType: 0,
      sign: ''
    };
    return this.accountApi.operatorEmail(data);
  }
  redirect() {
    window.name = 'redirect';
    location.reload();
  }
  install?(): void;
}
/* 实现一个切换账号的功能,切换后通知游戏再用新的用户信息去选择区服,我们的平台点击切换后重定向到初始登录页 */
export interface GamePayParams {
  userId?: number;
  gameZoneId: string;
  gameOrderId: string;
  roleId: string;
  roleName: string;
  level: number;
  gameCoin: number;
}
interface RegisterInfo {
  // 用户名
  userName: string;
  // 密码
  password: string;
  // 昵称
  nickName?: string;
  // 账号类型,游客注册不需要
  accountType: number;
  // web端使用来传递广告id
  thirdPartyId?: string;
  // 性别 0=男 1=女
  sex?: 0 | 1;
  // 生日
  birthday?: string;
  // 邮箱
  email?: string;
  // 电话
  telephone?: string;
  // 用户渠道,游客注册不需要
  userChannel: number;
  exInfo?: string;
}
interface FinishOrderParams {
  transactionId: string;
  channel: number;
  receipt: string;
  signature: string;
  exInfo?: string;
}
