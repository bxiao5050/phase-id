import * as Const from "./Constant"
import { signed } from "../utils";
import Http from "./Http";

export default class Api {
  static _ins: Api
  static get instance(): Api {
    return this._ins || new Api;
  }
  constructor() {
    Api._ins = this
  }

  private route = {
    bind: Const.RouteBindZone,
    bindVisitor: Const.RouteBindVisitor,
    forgetPwd: Const.RouteForgetPwd,
    operatorEmail: Const.RouteOperatorEmail,
    getRoleInfo: Const.RouteGetRoleInfo
  }

  /** 绑定区服 */
  public async Bind(BindZoneParam: BindZoneParam) {

    var deviceMsg = await JsToNative.getDeviceMsgAsync()

    var data = Object.assign(
      deviceMsg,
      BindZoneParam,
      {
        sign: signed([
          BindZoneParam.userId,
          RG.jssdk.config.appId,
          BindZoneParam.gameZoneId,
          deviceMsg.source,
          RG.jssdk.config.app_key
        ])
      }
    )
    return Http.instance.post({ route: this.route.bind, data }).then(data => {
      return data
    })
  }
  /*  绑定游客 */
  public BindVisitor(account: string, password: string) {
    var data = {
      appId: RG.jssdk.config.appId,
      userId: RG.CurUserInfo().userId,
      userName: account,
      password: password,
      email: '',
      sign: signed([
        RG.jssdk.config.appId,
        RG.CurUserInfo().userId,
        account,
        password,
        RG.jssdk.config.app_key
      ])
    }
    return Http.instance.post({ route: this.route.bindVisitor, data }).then(data => {
      if (data.code === 200) {
        var userInfo = RG.jssdk.Account.user

        userInfo.userName = account
        RG.jssdk.Account.user = userInfo
      }
      return data
    })
  }
  /* 忘记密码 */
  forgetPwd(params: forgetPwdParams): Promise<forgetPwdRes> {
    const { appId, userName } = params;
    // MD5(appId+userName+appKey)
    const sign = signed([appId, userName]);
    return Http.instance.get({ route: this.route.forgetPwd + `/${appId}/${userName}/${sign}` }) as Promise<forgetPwdRes>;
  }
  /* 添加邮箱 */
  operatorEmail(params: opeartorEmailParams): Promise<opeartorEmailRes> {
    const { appId, userId, email, operatorType } = params;
    var data = {
      appId,
      userId,
      email,
      operatorType,
      sign: signed([
        appId,
        userId,
        email,
        operatorType,
        RG.jssdk.config.app_key
      ])
    }
    return Http.instance.post({ route: this.route.operatorEmail, data }).then((res: opeartorEmailRes) => {
      if (res.code === 200) {
        var userInfo = RG.jssdk.Account.user;
        userInfo.email = email;
        userInfo.emailValid = res.data.emailValid;
        RG.jssdk.Account.user = userInfo
      }
      return data
    }) as Promise<opeartorEmailRes>;
  }
  getGameRoleInfo({ appId, userId, gameZoneId, appSecret }: { appId: string, userId: number, gameZoneId: number, appSecret: string }) {
    // userId+gameZoneId+timestamp+appSecret
    const timestamp = Date.now();
    const route = `${this.route.getRoleInfo}?appId=${appId}&userId=${userId}&gameZoneId=${gameZoneId}&timestamp=${timestamp}&sign=${signed([userId, gameZoneId, timestamp, appSecret])}`;
    return Http.instance.get({ route });
  }
}
// https://sdk-test.changic.net.cn/pocketgames/client/user/forgetPwd/10183/gtest/000ad20ed2da714d05c58cf3521c8cce
interface forgetPwdParams {
  appId: string;
  userName: string;
  // MD5(appId+userName+appKey)
  // sign:string;
}
interface forgetPwdRes extends ServerRes {
  data: {
    // 用户id
    userId: number;
    // 用户名
    userName: string;
    // 邮箱
    email: string;
    // 电话号
    phoneNumber: string
    // 邮箱是否验证，0=未设置 1=未验证 2=已验证
    emailValid: number
    // 1.正式账号 0.游客账号
    userType: UserType;
    // 账号类型
    accountType: Account;
  }
}

interface opeartorEmailParams {
  // 平台方分配给游戏的appId
  appId: number;
  // 用户ID
  userId: number;
  // 验证的邮箱
  email: string
  // 	int	0=绑定邮箱 1=解除绑定邮箱 ,全部传0
  operatorType: 0 | 1;
  // 参数签名结果 MD5(appId+userId+email+operatorType+appKey)
  // sign: string

}
interface opeartorEmailRes extends ServerRes {
  data: {
    // 用户id
    userId: number;
    // 用户名
    userName: string;
    // 邮箱
    email: string;
    // 电话号
    phoneNumber: string
    // 邮箱是否验证，0=未设置 1=未验证 2=已验证
    emailValid: number
    // 1.正式账号 0.游客账号
    userType: UserType;
    // 账号类型
    accountType: Account;
  }
}
