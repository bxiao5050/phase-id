// sdk类型
export enum SdkType {
  Web = 1,
  Native,
  FbWebGame,
  FbInstantGame,
  quickUniteSdk
}
export enum AccountType {
  visitor = 0,
  email,
  fb = 2,
  BTgame = 3,
  kakao = 11
}
// 用户渠道 0=默认渠道,平台,fb,kakao 1=appota 2=mwork
export enum UserChannel {
  default = 0,
  appota,
  mwork,
  BTgame = 5
}
export enum UserType {
  // 1.正式账号 0.游客账号
  visitor,
  formal
}
// 注册类型,fb,kakoa BTgame 的登录就是注册
export enum RegisterType {
  default,
  fb,
  kakao,
  BTgame,
  vistor
}
// 保存在localStorage中的信息的 key
export enum localStorageKeys {
  user = 'rg_user',
  users = 'rg_users'
}
// 所有的域名,后面使用打包时写死
export const serverOrigins = {
  sg: 'https://sdk-sg.pocketgamesol.com',
  de: 'https://sdk-de.pocketgamesol.com',
  vn: 'https://sdk-vn.pocketgamesol.com',
  test: 'https://sdk-test.changic.net.cn',
  dev: '/api'
};

export enum ErrorCode {
  // 注册时用户不存在
  userExist = 101,
  // 登录时账号或者密码错误
  usernameOrPasswordWrong,
  // 账号或者密码错误格式错误
  usernameOrPasswordFormatWrong,
  // token 不存在或者失效
  notToken,
  // 忘记密码，该用户名不存在
  notExistsUser,
  // 该用户没有绑定安全邮箱
  notExistEmail,
  //（绑定邮箱和修改密码）验证密码，该密码和原密码不匹配
  oldPasswordError,
  // 游客绑定账号，该用户已绑定账户
  userHasBindAccount,
  // 用户绑定区服信息失败
  userZoneBindError,
  //链接不完成，请重新生成
  urlError,
  // 链接已经过期，请重新申请
  urlOld,
  // 重置密码失败，请重新申请
  changePasswordError,
  // 该手机号码和邮箱已经绑定
  phoneAndEmailUsed,
  // 验证码失败
  verifyCodeError,
  // 重复游戏订单
  orderError = 201,
  // 该交易信息已经存在
  hasPaymentInfo,
  // 交易验证错误
  payVerifyError,
  // 卡已经被使用或不存在
  payCardNotFind,
  // 卡的 PIN 和序列号有误
  pinError,
  // 订单正在处理当中
  orderProcessing,
  // 卡未知错误
  unknowError,
  // 查询订单流水的订单信息状态为失败
  payError = 209,
  // 查询订单流水的订单信息状态不存在
  orderNotFind,
  // 订单初始化状态
  orderInit = 222,
  // 平台币余额不足
  platformCoinShort,
  // IOS 凭据校验超时
  iosOvertime,
  // 服务器异常
  serverError = 500,
  // 提交必须是 Post 方式
  isPostError,
  // 请检查传入的 api_key 参数是否正确
  apiKeyError,
  // MD5 验证失败
  md5CheckError
}
