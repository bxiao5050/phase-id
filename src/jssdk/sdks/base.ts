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

export default class Base {
  sdkVersion: string = VERSION;
  accountApi = new AccountApi();
  login = new Login();
  payment = new Payment();
  account = new Account();
  readonly devicePromise: Promise<DeviceMsg>;
  config: ExtendedConfig;
  initConfig(config: ExtendedConfig) {
    this.config = config;
    const appKey = config.appKey;
    /* 删除config中的 */
    delete config.appKey;
    this.accountApi.setAppKey(appKey);
    this.login.setAppKey(appKey);
    this.payment.setAppKey(appKey);
  }
  async platformLogin(userName: string, pwd: string) {
    const {appId, advChannel} = this.config.urlParams;
    // 密码限制长度的6-20位
    const password = pwd.length === 32 ? pwd : md5(pwd);
    const deviceMsg = await this.devicePromise;
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
      exInfo: '',
      sign: ''
    };
    return this.login.login(data).then(res => {
      if (res.code === 200) {
        this.account.user = Object.assign(res.data, {password, token: res.token});
      }
      return res;
    });
  }
  async platformRegister(params: RegisterInfo) {
    const {appId, advChannel} = this.config.urlParams;
    const password = md5(params.password);
    const deviceMsg = await this.devicePromise;
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
      exInfo: params.exInfo || '',
      sign: '',
      nickName: params.nickName || '',
      accountType: params.accountType,
      /* web端使用 advertiseId 来做广告的区分*/
      thirdPartyId: this.config.urlParams.advertiseId || '',
      email: params.email || '',
      telephone: params.telephone || '',
      userChannel: params.userChannel
    };
    return this.login.register(data).then(res => {
      if (res.code === 200) {
        this.account.user = Object.assign(res.data, {password, token: res.token});
        localStorage.removeItem('rg_isFaceLogin');
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
    const {channel, code, isOfficial, exInfo} = params;
    const {amount, currency, productName, itemType} = params.selectedProduct;
    let data: CreateOrderParams = {
      appId: +appId,
      advChannel: +advChannel,
      userId: this.account.user.userId,
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
    password = md5(password);
    let data: BindVisitorParams = {
      appId: +this.config.urlParams.appId,
      userId: this.account.user.userId,
      userName,
      password,
      email: '',
      sign: ''
    };
    return this.accountApi.bindVisitor(data).then(res => {
      if (res.code === 200) {
        this.account.user = Object.assign(this.account.user, {
          password,
          userName,
          userType: 1
        });
      }

      return res;
    });
  }
  async changePassword(oldpass: string, newpass: string) {
    let password = md5(oldpass);
    let newPassword = md5(newpass);
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
          password: newPassword
        });
      }
      return res;
    });
  }
  async verifyPassword(password: string) {
    password = md5(password);
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
  // userId: number;
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
