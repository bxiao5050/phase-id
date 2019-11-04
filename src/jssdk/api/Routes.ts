/* sdk 初始化请求地址  http://ip:port/pocketgames/client/config/v3.1/initSDK*/
export const RouteInitSDK = "/config/v3.1/initSDK";

/** Payment */
export const RoutePaymentConfig = '/config/paymentConfig/v4.0';
export const RouteCreateOrder = '/order/create/v4.0';
export const RouteOrderList = '/order/getOrderList';
export const RouteFinishOrder = '/official/order/finish/v4.0';
// 绑定区服
export const RouteBindZone = '/user/v3/bindZone';
// 游客账号升级
export const RouteBindVisitor = '/user/bindVisitor';

// 登录注册
export const RouteLogin = '/user/v3/login';
export const RouteRegister = '/user/v3/register';

/* 联运 sdk 接口 */

// 获取游戏角色信息请求地址 http://ip:port/pocketgames/client/user/role
export const RouteGetRoleInfo = "/user/role";

// Token校验接口 http://ip:port/pocketgames/client/quick/verifyToken/{appId}/{advChannel}/{uid}/{token}/{sign}
export const RouteQuickVerifyToken = "/quick/verifyToken";

// 暂时还没有使用的请求路由

// 修改密码，第三方不许修改密码 http://ip:port/pocketgames/client/user/changePwd
export const RouteChangePassword = '/user/changePwd';

// 找回密码的接口 http://ip:port/pocketgames/client/user/forgetPwd/{appId}/{userName}/{sign}
export const RouteForgetPwd = "/user/forgetPwd";

//绑定密保邮箱 http://ip:port/pocketgames/client/user/operatorEmail
export const RouteOperatorEmail = "/user/operatorEmail";
