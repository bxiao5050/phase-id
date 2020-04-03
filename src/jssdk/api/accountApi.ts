import {signed} from '../utils';
import Http from '../api/Http';

export default class AccountApi {
  private appKey: string = '';
  /* 设置加密参数 */
  setAppKey(appKey: string) {
    this.appKey = appKey;
  }
  /* 用户绑定区服 */
  bindZone(params: BindZoneParams) {
    params.sign = signed([
      params.userId,
      params.appId,
      params.gameZoneId,
      params.source,
      this.appKey
    ]);
    return Http.ins.post({route: '/user/v3/bindZone', data: params});
  }
  /* 游客升级账号 */
  bindVisitor(params: BindVisitorParams) {
    params.sign = signed([
      params.appId,
      params.userId,
      params.userName,
      params.password,
      this.appKey
    ]);
    return Http.ins.post<UserInfoRes>({route: '/user/bindVisitor', data: params});
  }
  /* 修改密码，第三方登录不允许修改密码 */
  changePassword(params: ChangePwdParams) {
    params.sign = signed([
      params.appId,
      params.userId,
      params.password,
      params.newPassword,
      this.appKey
    ]);
    return Http.ins.post({route: '/user/changePwd', data: params});
  }
  /* 验证密码 */
  verifyPassword(appId: string, userId: number, password: string) {
    const sign = signed([appId, userId, password, this.appKey]);
    return Http.ins.get({route: `/user/forgetPwd/${appId}/${userId}/${password}/${sign}`});
  }
  /* 忘记密码 */
  forgetPassword(appId: string, userName: string) {
    const sign = signed([appId, userName, this.appKey]);
    return Http.ins.get<forgetPwdRes>({route: `/user/forgetPwd/${appId}/${userName}/${sign}`});
  }
  /* 绑定邮箱 */
  operatorEmail(params: OpeartorEmailParams) {
    params.sign = signed([
      params.appId,
      params.userId,
      params.email,
      params.operatorType,
      this.appKey
    ]);
    return Http.ins.post<UserInfoRes>({route: '/user/operatorEmail', data: params});
  }
}
/* 修改密码的参数 */
export interface ChangePwdParams {
  appId: number;
  userId: number;
  password: string;
  newPassword: string;
  sign: string;
}
/* 修改邮箱的参数 */
export interface OpeartorEmailParams {
  // 平台方分配给游戏的appId
  appId: number;
  // 用户ID
  userId: number;
  // 验证的邮箱
  email: string;
  // 	int	0=绑定邮箱 1=解除绑定邮箱 ,全部传0
  operatorType: 0 | 1;
  // 参数签名结果 MD5(appId+userId+email+operatorType+appKey)
  sign: string;
}
/* 忘记密码的返回值 */
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
/* 绑定游客的参数 */
export interface BindZoneParams {
  userId: number;
  appId: number;
  // 游戏区服 ID
  gameZoneId: string;
  // 0=非创角 1=创角
  createRole: number;
  source: number;
  advChannel: number;
  network: number;
  model: string;
  operatorOs: string;
  deviceNo: string;
  device: string;
  // 角色 id
  roleId: string;
  // 角色等级
  level: string;
  // 游戏版本
  version: string;
  // SDK 版本
  sdkVersion: string;
  sign: string;
}
/* 游客升级的参数 */
export interface BindVisitorParams {
  appId: number;
  userId: number;
  userName: string;
  password: string;
  email: string;
  sign: string;
}
export interface UserInfoRes extends ServerRes {
  data: ResUserInfo;
}
export interface ResUserInfo {
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
}
