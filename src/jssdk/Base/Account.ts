import Http from './Http';
import {signed} from '../utils';

export default class Account {
  static _ins: Account;
  static get ins(): Account {
    return this._ins || new Account();
  }
  constructor() {
    Account._ins = this;
    this._initPromise = new Promise(resolve => {
      this.initResolve = resolve;
    });
  }
  /** 当前用户 */
  private _user: UserInfo;
  /** 用户组 */
  private _users: UsersInfo = {};

  initResolve;
  _initPromise;
  initPromise() {
    if (RG.jssdk.config.type === 2) {
      this.init({
        user: JSON.parse(localStorage.getItem('user')),
        users: JSON.parse(localStorage.getItem('users'))
      });
    }
    return this._initPromise;
  }

  init(data) {
    data.user && (this._user = data.user);
    data.users && (this._users = data.users);
    this.initResolve();
  }

  get user() {
    return this._user;
  }

  get users() {
    return this._users;
  }

  asyncData() {
    if (RG.jssdk.config.type === 2) {
      localStorage.setItem('user', JSON.stringify(this._user));
      localStorage.setItem('users', JSON.stringify(this._users));
    } else {
      const index_origin = IS_DEV
        ? window.$rg_main.config.page.index.test
        : window.$rg_main.config.page.index.formal;
      window.$postMessage(
        JSON.stringify({
          action: 'set',
          data: {
            user: this._user,
            users: this._users
          }
        }),
        /(http|https):\/\/(www.)?([A-Za-z0-9-_]+(\.)?)+/.exec(index_origin)[0]
      );
    }
  }

  set user(user) {
    this._user = user;
    if (user && user.accountType !== 2) {
      this._users[user.userId] = user;
    }
    this.asyncData();
  }

  set users(users) {
    this._users = users;
    this.asyncData();
  }

  delCurUser(userId) {
    if (this._users[userId]) {
      delete this._users[userId];
      this._user = null;
      this.asyncData();
    }
  }

  changePass(oldpass: string, newpass: string) {
    var data = {
      appId: RG.jssdk.config.appId,
      userId: this.user.userId,
      password: oldpass,
      newPassword: newpass,
      sign: null
    };

    data.sign = signed([
      RG.jssdk.config.appId,
      this.user.userId,
      oldpass,
      newpass,
      RG.jssdk.config.app_key
    ]);

    return Http.ins.post({
      route: '/user/changePwd',
      data: data
    });
  }
}

interface BindZoneParams {
  // userId 用户id
  userId: number;
  // gameZoneId 区服id
  gameZoneId: number;
  // createRole  是否创角 0=否 1=是
  createRole: number;
  // roleId  角色id
  roleId: number;
  // level 角色等级
  level: number;

  appId: number;
  advChannel: number;
  appKey: string;
}
export async function bindZone(
  params: BindZoneParams,
  deviceMsg: JsToNativeDeviceMsg
): Promise<ServerRes> {
  const {source, network, model, operatorOs, device, deviceNo, version} = deviceMsg;
  const {gameZoneId, createRole, roleId, level, userId, appId, advChannel, appKey} = params;
  const sign = signed([userId, appId, gameZoneId, source, appKey]);
  const data = {
    userId,
    appId,
    gameZoneId,
    createRole,
    source,
    advChannel,
    network,
    model,
    operatorOs,
    device,
    deviceNo,
    roleId,
    level,
    version,
    sdkVersion: '',
    sign
  };
  return Http.ins.post({route: '/user/v3/bindZone', data});
}
export interface BindVisitorParams {
  userName: string;
  password: string;
  appId: number;
  appKey: string;
  userId: number;
}
// 绑定游客
export function bindVisitor(params: BindVisitorParams) {
  const {appId, appKey, userName, password, userId} = params;
  const data = Object.assign(params, {sign: signed([appId, userId, userName, password, appKey])});

  return Http.ins.post({route: '/user/bindVisitor', data});
}
export interface forgetPwdRes extends ServerRes {
  data: {
    // 用户id
    userId: number;
    // 用户名
    userName: string;
    // 邮箱
    email: string;
    // 电话号
    phoneNumber: string;
    // 邮箱是否验证，0=未设置 1=未验证 2=已验证
    emailValid: number;
    // 1.正式账号 0.游客账号
    userType: number;
    // 账号类型
    accountType: Account;
  };
}
/* 忘记密码 */
export function forgetPwd(appId: string, userName: string, appKey: string) {
  // MD5(appId+userName+appKey)
  const sign = signed([appId, userName, appKey]);
  return Http.ins.get<forgetPwdRes>({route: `/user/forgetPwd/${appId}/${userName}/${sign}`});
}

export interface opeartorEmailParams {
  // 平台方分配给游戏的appId
  appId: number;
  // 用户ID
  userId: number;
  // 验证的邮箱
  email: string;
  // 	int	0=绑定邮箱 1=解除绑定邮箱 ,全部传0
  operatorType: 0 | 1;
  // 参数签名结果 MD5(appId+userId+email+operatorType+appKey)
  appKey: string;
  // sign: string
}
export interface opeartorEmailRes extends ServerRes {
  data: {
    // 用户id
    userId: number;
    // 用户名
    userName: string;
    // 邮箱
    email: string;
    // 电话号
    phoneNumber: string;
    // 邮箱是否验证，0=未设置 1=未验证 2=已验证
    emailValid: number;
    // 1.正式账号 0.游客账号
    userType: number;
    // 账号类型
    accountType: number;
  };
}
/* 添加邮箱 */
export function operatorEmail({appId, userId, email, operatorType, appKey}: opeartorEmailParams) {
  const sign = signed([appId, userId, email, operatorType, appKey]);
  const data = {appId, userId, email, operatorType, sign};
  return Http.ins.post<opeartorEmailRes>({route: '/user/operatorEmail', data});
}

export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
  userId: number;
  appId: number;
  appKey: string;
}

// 修改密码，第三方登录不允许修改密码
export function changePassword({
  oldPassword,
  newPassword,
  userId,
  appId,
  appKey
}: ChangePasswordParams) {
  const sign = signed([appId, userId, oldPassword, newPassword, appKey]);
  const data = {appId, userId, password: oldPassword, newpass: newPassword, sign};
  return Http.ins.post({route: '/user/changePwd', data});
}

export interface UserInfo {
  accountType: number;
  emailValid: number;
  firstLogin: number;
  userId: number;
  userName: string;
  userType: UserType;
  password: string;
  token: string;
}


