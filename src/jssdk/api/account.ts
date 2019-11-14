/*
  所有的操作账户数据的接口
*/

import Http from "./http";
import {
  RouteChangePassword,
  RouteBindZone,
  RouteBindVisitor,
  RouteForgetPwd,
  RouteOperatorEmail,
  RouteGetRoleInfo
} from "./Routes";
import { signed } from "../utils";
import Account from "../Base/Account";

//绑定区服
export async function bindZone({ gameZoneId, createRole, roleId, level }: BindZoneParam): Promise<Res> {
  const { appId, app_key, advChannel } = window.$rg_main.config;
  const userId = RG.CurUserInfo().userId;
  const { source, network, model, operatorOs, device, deviceNo, version } = await JsToNative.getDeviceMsgAsync();
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
    sdkVersion: "",
    sign: signed([userId, appId, gameZoneId, source, app_key])
  };
  return Http.instance.post({ route: RouteBindZone, data })
}
// 绑定游客
export function bindVisitor(userName: string, password: string) {
  const { appId, app_key } = window.$rg_main.config;
  const userId = RG.CurUserInfo().userId;
  const data = { appId, userId, userName, password, email: "", sign: signed([appId, userId, userName, password, app_key]) };
  return Http.instance.post({ route: RouteBindVisitor, data }).then(data => {
    if (data.code === 200) {
      Account.instance.user = Object.assign({}, Account.instance.user, { userName });
    }
    return data;
  });
}
// 修改密码
export function changePassword(oldPassword: string, newPassword: string): Promise<Res> {
  const { appId, app_key } = window.$rg_main.config;
  const userId = RG.CurUserInfo().userId;
  const data = {
    appId,
    userId,
    password: oldPassword,
    newpass: newPassword,
    sign: signed([appId, userId, oldPassword, newPassword, app_key])
  }
  return Http.instance.post({ route: RouteChangePassword, data });
}

/* 忘记密码 */
export function forgetPwd(appId: string, userName: string): Promise<forgetPwdRes> {
  // MD5(appId+userName+appKey)
  const sign = signed([appId, userName]);
  return Http.instance.get({ route: this.route.forgetPwd + `/${appId}/${userName}/${sign}` });
}
/* 添加邮箱 */
export function operatorEmail(params: opeartorEmailParams) {
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
      RG.jssdk.Account.user = userInfo;
    }
    return res
  });
}



interface forgetPwdRes extends Res {
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
interface opeartorEmailRes extends Res {
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
