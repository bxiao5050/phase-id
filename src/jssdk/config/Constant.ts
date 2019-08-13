/** localstorage */
// export var UserInfo = PREFIX + '-' + 'userInfo'
// export var UsersInfo = PREFIX + '-' + 'usersInfo'
// export var LoginData = PREFIX + '-' + 'loginData'
/**
 * route
 */


export const RouteBindZone = '/user/v3/bindZone';

/** Payment */
export const RoutePaymentConfig = '/config/paymentConfig/v4.0';
export const RouteCreateOrder = '/order/create/v4.0';
export const RouteOrderList = '/order/getOrderList';
export const RouteFinishOrder = '/official/order/finish/v4.0';


export const RouteBindVisitor = '/user/bindVisitor';
export const RouteChangePassword = '/user/changePwd';
/*  找回密码的接口/pocketgames/client/user/forgetPwd/{appId}/{userName}/{sign}*/
export const RouteForgetPwd = "/user/forgetPwd";
export enum ERROR {
  E_001 = 'appId or advChannel is not defined'
}

export enum GET {
  USER = 'user',
  APP_ID = 'appId',
  ADV_CHANNEL = 'advChannel',
  DEBUGGER = 'debugger',
  DEV = 'dev',
  CLIENT = 'client'
}

export enum DOT {

  SDK_LOADED = 'sdk_loaded',
  SDK_PURCHASED_DONE = 'sdk_purchased_done',
  SDK_REGISTER = 'sdk_register',
  SDK_CONTACT_US = 'sdk_contact_us',

  FB_REGISTER = 'CompleteRegistration',

}
