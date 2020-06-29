import {signed} from '../utils';
import Http from '../api/Http';

export default class Login {
  private appKey: string = '';
  /* 设置加密参数 */
  setAppKey(appKey: string) {
    this.appKey = appKey;
  }
  /* 平台登录 */
  login(params: LoginParam) {
    params.sign = signed([
      params.appId,
      params.userName,
      params.password,
      params.source,
      this.appKey
    ]);
    return Http.ins.post<LoginAndRegisterRes>({route: '/user/v3/login', data: params});
  }
  /* 平台注册 */
  register(params: RegisterParams) {
    params.sign = signed([
      params.appId,
      params.userName,
      params.password,
      params.source,
      this.appKey
    ]);
    return Http.ins.post<LoginAndRegisterRes>({route: '/user/v3/register', data: params});
  }
}

// 登录的参数
export interface LoginParam {
  // 应用 ID
  appId: number;
  // 用户名
  userName: string;
  // 密码
  password: string;
  /** 来源 0=ANDROID客户端 1=IOS客户端 2=网页 */
  source: number;
  // 包渠道 0=appstore 1=google play...
  advChannel: number;
  /** 网络 0=wifi 1 = 3g 2=其他 */
  network: number;
  /** 机型 */
  model: string;
  /** 操作系统，例如Android4.4 */
  operatorOs: string;
  /** 设备号 */
  deviceNo: string;
  /** Android:MAC地址 IOS:IDFA */
  device: string;
  /** 游戏版本 */
  version: string;
  /** SDK版本号 */
  sdkVersion: string;
  // 额外信息
  exInfo?: string;
  sign: string;
}

// 注册的参数
export interface RegisterParams extends LoginParam {
  nickName?: string;
  accountType: number;
  // web端使用来传递广告id
  thirdPartyId?: string;
  sex?: 0 | 1;
  birthday?: string;
  email?: string;
  telephone?: string;
  userChannel: number;
}
// 登录和注册的服务器响应数据
export interface LoginAndRegisterRes extends ServerRes {
  data: {
    // 用户id
    userId: number;
    // 用户名
    userName: string;
    // 1.正式账号 0.游客账号
    userType: 0 | 1;
    // 账号类型
    accountType: number;
    // 邮箱
    email: string;
    // 邮箱是否验证，0=未设置 1=未验证 2=已验证
    emailValid: 0 | 1 | 2;
    // 电话号
    telephone: string;
    // 0=登陆  1 = 注册
    firstLogin: 0 | 1;
  };
  // 是否第一次登录
  firstLogin: boolean;
  // 平台token
  token: string;
}
