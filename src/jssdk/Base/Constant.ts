/** localstorage */
// export var UserInfo = PREFIX + '-' + 'userInfo'
// export var UsersInfo = PREFIX + '-' + 'usersInfo'
// export var LoginData = PREFIX + '-' + 'loginData'
/** 
 * route
 */

export var RouteChangePassword = '/user/changePwd'
export var RouteBindZone = '/user/v3/bindZone'

/** Payment */
export var RoutePaymentConfig = '/config/paymentConfig/v4.0'
export var RouteCreateOrder = '/order/create/v4.0'
export var RouteOrderList = '/order/getOrderList'
export var RouteFinishOrder = '/official/order/finish/v4.0'


export var RouteBindVisitor = '/user/bindVisitor'

export enum ERROR {
  E_001 = 'appId or advChannel is not defined'
}

export enum GET {
  USER = 'user',
  APP_ID = 'appId',
  ADV_CHANNEL = 'advChannel',
  DEBUGGER = 'debugger',
  DEV = 'dev'
}

export enum DOT {
  SDK_LOADED = 'sdkinifinish',
  SDK_PURCHASED_DONE = 'Purchased',
  SDK_REGISTER = 'CompleteRegistration',
  SDK_CONTACT_US = 'contact_us',
  SDK_LOGIN = 'login',
  GAME_LAUNCH = 'gamelaunch'
}