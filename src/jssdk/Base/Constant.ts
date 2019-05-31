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
  DEV = 'dev',
  CLIENT = 'client'
}

export enum DOT {
  SDK_LOADED = 'sdk_loaded',
  SDK_PURCHASED_DONE = 'sdk_purchased_done',
  SDK_REGISTER = 'sdk_register',
  SDK_CONTACT_US = 'sdk_contact_us'

}