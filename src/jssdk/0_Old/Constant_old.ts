/**
 * route
 */
/** Payment */
export const RoutePaymentConfig = '/config/paymentConfig/v4.0';
export const RouteCreateOrder = '/order/create/v4.0';
export const RouteOrderList = '/order/getOrderList';
export const RouteFinishOrder = '/official/order/finish/v4.0';
// 绑定区服
export const RouteBindZone = '/user/v3/bindZone';
// 游客账号升级
export const RouteBindVisitor = '/user/bindVisitor';
// 修改密码，第三方不许修改密码
export const RouteChangePassword = '/user/changePwd';
/*  找回密码的接口/pocketgames/client/user/forgetPwd/{appId}/{userName}/{sign}*/
export const RouteForgetPwd = "/user/forgetPwd";
//绑定密保邮箱
export const RouteOperatorEmail = "/user/operatorEmail";
// 获取游戏角色信息
export const RouteGetRoleInfo = "/user/role";

// 登录注册
export const RouteLogin = '/user/v3/login';
export const RouteRegister = '/user/v3/register';

// 地址栏参数
export const GET = {
  USER: 'user',
  APP_ID: 'appId',
  ADV_CHANNEL: 'advChannel',
  DEBUGGER: 'debugger',
  DEV: 'dev',
  CLIENT: 'client',
  ADVERTISE_Id: "advertiseId"
};
//sdk内部固定点的点名
export const DOT = {
  SDK_LOADED: 'sdk_loaded',
  SDK_PURCHASED_DONE: 'sdk_purchased_done',
  SDK_REGISTER: 'sdk_register',
  SDK_CONTACT_US: 'sdk_contact_us',
  //网页端登录需要传这个点名，现在sspa10083中适配
  // FB_REGISTER = 'CompleteRegistration',
};

/** localstorage */
// export var UserInfo = PREFIX + '-' + 'userInfo'
// export var UsersInfo = PREFIX + '-' + 'usersInfo'
// export var LoginData = PREFIX + '-' + 'loginData'
