
/** jssdk 版本 */
declare const VERSION: JSSDK.Version;
declare const VConsole: any;
/** 是否为开发环境 */
declare const IS_DEV: boolean;
declare const IS_TEST: boolean;
declare const Adjust: any;
declare const QuickSDK: any;
/* 账户类型0. 普通用户  1.Email用户 2 fb账号 3.gamecent账号 4. Google账号 5.line账号
6.vk账号 */
type AccountType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type UserType = 0 | 1;
type Region = "test" | "sg" | "de" | "vn";
// 平台来源 0 = ios 1 = android 2 = 网页支付 3 = PC web登录
type SourceType = 0 | 1 | 2 | 3;
// 网络 0=wifi 1 = 3g 2=其他
type NetWork = 0 | 1 | 2;
// 性别 0=男 1=女
type Sex = 0 | 1;
// 用户渠道 0=默认渠道 1=appota 2=mwork
type UserChannel = 0 | 1 | 2;

declare namespace JSSDK {
  /** 1: web端 2：原生应用 3：facebook页游平台 4：facebook instant games */
  type Type = 1 | 2 | 3 | 4;
  /** jssdk 版本 */
  type Version = string;
  type CurUserInfo = {
    userId: number;
    userName: string;
    token: string;
  };
  /** jssdk 配置项 */
  interface RG {
    CurUserInfo: CurUserInfo;
  }
  interface Config {
    name: string;
    appId: number;
    app_key: string;
    advChannel: number;
    scopeId?: string;
    fb_app_id: string;
    FbPageId: string;
    test: string;
    // 语言
    language: string;
    i18n: any;
    type: Type;
    // 控制首次请求的地址，将来放在urlParams中有sg、de、vn,或者test三个值
    region: string;
    // 悬浮球距离顶边的距离rem
    hoverTop: number
    // 悬浮球是在左边还是右边
    hoverFromLeft: boolean
    // 如果游戏会进行支付打点，此值是false，反之则是true
    isPurchasedMark: boolean,
    mark_id: {
      fb: string;
      ga: string;
      // 需要改变的打点的名称
      markName: {
        [key: string]: string
      }
      adjust: {
        [key: string]: string
      }
    };
    server: {
      test: string;
      formal: string;
    };
    download: {
      android: string
      ios: string
    }
    page: {
      index: {
        test: string;
        formal: string;
      };
      game: {
        test: string;
        formal: string;
      };
      facebook: {
        messenger: {
          pc: string;
          mobile: string;
        },
        index: string
      };
    };
    urlParams: UrlParams;
    /* 联运需要的参数 */
    code?: number;
    channel?: number;
    userChannel?: number;
    /*  联营的传3 */
    accountType?: number;
    appSecret?: string;
    productCode?: string;
    productKey?: string;
  }
}

interface RG {
  /**
   * SDK - 版本号
   */
  version: string;

  jssdk: Base;

  /** 获取支付数据 */
  Pay(paymentConfig: PaymentConfig): void;
  init();
  /** 跳转到messenger页面 */
  Messenger();

  Redirect();
  /** x */
  ChangeAccount();

  /** 跳转到fb应用 */
  Fb();

  /** 获取当前用户数据2 */
  CurUserInfo(): UserInfo;

  /** 分享接口 */
  Share(shareUrl: string);

  /** 绑定区服 */
  BindZone(bindZoneParam: BindZoneParam): Promise<Res>;

  Mark(markName: string, extraParam?: any): void;

  Install(): void;
}

// import PaymentConfig from "DOM/payment/PaymentConfig";

declare interface Window {
  RG: RG;
  fbAsyncInit: Function;
  FB: fb.FacebookStatic;
  FBInstant: any;
  getLoginStatus: Promise<any>;
  rgAsyncInit: Function;
  JsToNative: JsToNative;
  NativeToJs: NativeToJs;
  rgChangeAccount: Function;
  RgPolyfilled: Function;
  debugger: boolean;
  $rg_index: Function;
  $rg_main: {
    config: JSSDK.Config;
    get_game_config: Promise<any>;
    Mark: {
      index_url: HTMLAnchorElement;
      game_url: HTMLAnchorElement;
      Mark: Function;
    };
  };
  $postMessage: Function;
  XMLHttpRequest: any;
  opera: any;
  // 测试使用
  _RG_REGION: string;
  changePostmessageAndRegion: Function;
  QuickSDK: any
}

declare var FBVersion: string;
declare var ACTION: string;
declare var reactSrc: string;
declare var reactDomSrc: string;
declare var reactRouterDomSrc: string;

interface NativeToJs {
  // {
  //   transactionId: string // 订单id
  //   code: number // 状态，200为成功
  //   error_msg: number// 失败信息
  //   money: string // 金额
  //   currency: string // 货币
  // }
  jpworkResult(params: string);
  // {
  //   transactionId: string // 订单id
  //   channel: number // 支付方式
  //   receipt: string // APPSTORE单据或者Google play signatureData
  //   signature: string	// Google play signature
  //   exInfo: string // 支付校验接口回传的透传字段
  // }
  consumeOrder(params: string);

  goBack();

  deviceMsg(params: string);
}

interface initSDKParams {
  /** 平台方分配给游戏的appId */
  appId: number;
  /** 平台来源0=ios 1=android 2=web */
  source: number;
  /** -1=IOS企业包0=AppsSore 1=GooglePlay等等，具体渠道请见渠道表 */
  advChannel: number;
  /** 网络 0=wifi 1 = 3g 2=其他 */
  network: number;
  /** 机型 */
  model: string;
  /** 操作系统 */
  operatorOs: string;
  /** 设备号 */
  deviceNo: string;
  /** 设备 (Android=MAC#ANDRIDID IOS=IDFA） */
  device: string;
  /** 游戏版本 */
  version: string;
  /** SDK 版本 */
  sdkVersion: string;
  /** 客户端时间 (yyyy-MM-dd HH:mm:ss) */
  clientTime: string;
  /** 0=非首次安装 1=首次安装 */
  firstInstall: number;
  /** 参数签名结果 MD5(appId+source+advChannel+app_key) */
  sign: string;
}

interface JsToNativeDeviceMsg {
  gaid: string;
  device: string;
  deviceNo: string;
  version: string;
  model: string;
  operatorOs: string;
  source: number;
  network: number;
}

interface JsToNative {

  //获取设备参数 ios是解析后的对象不是JSON字符串
  getDeviceMsg(): string;
  getDeviceMsgAsync(): Promise<JsToNativeDeviceMsg>;
  /**
   * 初始化
   * @param params
   */
  // init(params: {
  //   gpVerify: string
  //   gpProduct: String
  // })
  init(params: string);
  /**
   * 事件打点
   * @param params
   */
  // gameEvent(params: {
  //   /** 打点事件名称（必传） */
  //   eventName: string
  //   /** 用户id（可选） */
  //   userId?: number
  //   /** 金额（可选） */
  //   money?: number
  //   /** 货币类型（可选） */
  //   currency?: string
  //   /** 游戏订单id（可选） */
  //   gameOrderId?: string
  // })
  gameEvent(params: string);
  /**
   * 调启支付
   * @param params
   */
  // jpwork(params: {
  //   /** 商品名 */
  //   productName: string
  //   /** 交易id */
  //   transactionId: string
  //   /** 支付方式 0=appstore 1=google play 2=vnpt 3=1pay 4=mol */
  //   channel: number
  //   /** 货币类型 */
  //   currency: string
  //   /** 金额 */
  //   money: number
  // })
  jpwork(params: string);
  /**
   * 消单
   * @param param
   */
  // consumeOrder(param: {
  //   /** 支付校验接口回传的透传字段 */
  //   exInfo: string
  // })
  consumeOrder(param: string);

  exitApp();
}

declare var JsToNative: JsToNative;
declare var NativeToJs: NativeToJs;
declare var CryptoJS: any;

declare interface HTMLElement {
  show: Function;
  hide: Function;
}

declare interface Date {
  format: Function;
}

/** Store类的前缀字符串 */
declare var PREFIX: string;

declare var md5: Function;

/** 这个变量是什么意思 */
declare var AvialableIp: string;
// declare var import: Promise<any>
declare var React: any;
declare var ReactDom: any;
declare var Router: any;
declare var RG: RG;

declare var SERVER: string;

type SDKs = RoyalGames | FacebookWebGames | NativeGames | FacebookInstantGames;

interface RoyalGames {
  RoyalGames;
  Login();
}

interface FacebookWebGames {
  FacebookWebGames;
  Login();
}

interface FacebookInstantGames {
  FacebookInstantGames;
  Login();
}

interface NativeGames {
  NativeGames;
  Login();
  init();
}

interface FinishOrderParams {
  transactionId: string;
  channel: number;
  receipt: string;
  signature: string;
  exInfo: string;
}

interface Base0 {
  /**
   * 版本号
   */
  version: string;

  config: JSSDK.Config;

  fb_sdk_loaded: boolean;

  key
  iv
  deviceMsgPromise
  deviceMsgResolve
  nativeInit
  nativeIsInit
  AESdecode
  consumeOrder
  jpworkResult
  goBack
  gotDeviceMsg


  init
  polyfilled();

  App: any;

  /**
   * 1: web端
   * 2：原生应用
   * 3：facebook页游平台
   * 4：facebook instant games
   */
  type: number;

  Login(params?: LoginParam): Promise<LoginRes>;

  initDebugger();

  /** 跳转到messenger页面 */
  Messenger();

  /** 跳转到fb应用 */
  Fb();

  /** 获取当前用户数据2 */
  CurUserInfo(): {
    userId: number;
    userName: string;
    token: string;
  };

  /** 分享接口 */
  Share(shareUrl: string);

  /** 绑定区服 */
  BindZone(bindZoneParam: BindZoneParam): Promise<Res>;

  Account: any;

  // /** 获取当前用户数据 */
  // GetUser(): UserInfo

  // /** 设置当前用户数据 */
  // SetUser(userInfo: UserInfo, userId?: any)

  // /** 获取用户组数据 */
  // GetUsers(): UsersInfo

  // /** 设置用户组数据 */
  // SetUsers(usersInfo: UsersInfo): void

  /** 获取游戏跳转地址 */
  // GetRedirectUrl()

  /** 修改当前账户密码 */
  ChangePassword(oldpass: string, newpass: string): Promise<Res>;

  VisitorUpgrade(username: string, pass: string): Promise<Res>;

  /** 获取订单列表 */
  GetPaymentHistory(): Promise<Res>;

  /** 获取支付数据 */
  PaymentConfig(PaymentConfig: PaymentConfig): Promise<PaymentConfigRes>;

  Ordering(OrderingData: OrderingData, extraInfo?: any): Promise<OrderRes>;

  FinishOrder(finishOrderParams: FinishOrderParams): Promise<Res>;
}

type Base = Base0;

declare namespace FBInstant {
  // interface FBinstantSDK extends Base {
  //   /**
  //    * 版本号
  //    */
  //   version: string
  //   // CreateShortcut(): Promise<boolean>
  // }

  // interface SDK extends Base {
  //   /**
  //   * SDK - 版本号
  //   */
  //   version: string

  //   /** 获取支付数据 */
  //   Pay(paymentConfig: PaymentConfig): void
  // }

  interface DOMApp {
    showLogin(): void;
    hideLogin(): void;
    showPayment(paymentConfig: PaymentConfigRes): void;
    hidePayment(): void;
    showNotice(msg: string): void;
    hideNotice(): void;
    showAccount(): void;
    hideAccount(): void;
  }
}

interface App {
  showPayment(paymentConfigRes: PaymentConfigRes);
}

declare namespace RG {
  /**
   * 下单参数
   */

  type PayParams = FbWebGamesPayParams;

  interface FbWebGamesPayParams extends PaymentConfig {
    product_id: string;
  }

  interface PaymentConfig {
    userId: number;
    gameOrderId: number;
    gameZoneId: number;
    roleId: number;
    roleName: string;
    level: number;
    gameCoin: number;
    sign: string;
  }
}

interface PaymentConfig {
  userId: number;
  gameZoneId: number;
  gameOrderId: number;
  roleId: number;
  roleName: string;
  level: number;
  gameCoin: number;
}

interface OrderRes extends Res {
  data: {
    currency: string;
    money: number;
    transactionId: string;
    returnInfo: {
      url: string;
    };
  };
}

type OrderingData = PaymentChannel;

interface PaymentChannel {
  isFacebook?: boolean;
  nodes?: PaymentChannel[];
  channel: number;
  code: number;
  codeImg: string;
  description: string;
  exInfo: string;
  isOfficial: number;
  name: string;
  products: Product[];
  selectedProduct: Product;
  showMethod: number;
  showProductList: number;
}

interface FinishOrderPostData {
  /** 交易流水 */
  transactionId: string;
  /** APPSTORE单据或者Google play signatureData */
  receipt: string;
  /** Google play signature */
  signature: String;
  /** 支付方式 0=appstore 1=google play 2=vnpt 3=1pay 4=mol 28=facebook */
  channel: number;
  /** 包ID */
  advChannel: number;
  /** SDK版本 */
  sdkVersion: string;
  /** 客户端提交时间 "yyyy-MM-dd hh:mm:ss" */
  clientTime: string;
  /** 参数签名结果 MD5(transactionId + receipt + signature + channel + advChannel + app_key) */
  sign: string;
  /** 设备号 */
  deviceNo: string;
  /** Android: MAC地址 IOS: IDFA */
  device: string;
  /** 网络 0 = wifi 1 = 3g 2 = 其他 */
  network: number;
  /** 机型 */
  model: string;
  /** 操作系统，例如Android4.4 */
  operatorOs: string;
  /** 游戏版本 */
  version: string;
  /** 额外的信息 */
  exInfo?: string;
}

interface PaymentConfigParams {
  /** 平台方分配给游戏的appId */
  appId: number;
  /** 0=appstore 1=google play 具体查看包常量表 */
  advChannel: number;
  /** 平台用户ID */
  userId: number;
  /** 游戏内角色id */
  roleId: number;
  /** 0=ios 1=android */
  source: number;
  // 网络 0=wifi 1 = 3g 2=其他
  network: number;
  /** 角色等级 */
  level: number;
  /** 游戏版本 控制每种支付方式的开关 */
  version: string;
  /** 游戏币数量 */
  gameCoin: number;
  /** 额外参数 */
  exInfo?: string;
  /** 验证参数MD5(appId+ advChannel+userId+gameCoin+level +source+ network +app_key) */
  sign: string;
}

interface CreateOrderParams {
  /** 平台方分配给游戏的appId */
  appId: number;
  /** 0=appstore 1=google play 具体查看包常量表 */
  advChannel: number;
  /** 平台用户ID */
  userId: number;
  /** 游戏订单ID */
  gameOrderId: string;
  /** 游戏区服ID */
  gameZoneId: string;
  /** 角色ID */
  roleId: string;
  /** 角色ID */
  roleName: string;
  /** 角色等级 */
  level: string;
  /** 充值来源 0=ANDROID客户端 1=IOS客户端 2=网页 */
  source: number;
  /** 支付渠道 0=appstore 1=google play 2=vnpt 3=1pay 4=mol,具体见渠道常量表 */
  channel: number;
  /** CODE值，具体见支付方式常量表 */
  code: number;
  /** 金额 */
  amount: string;
  /** 货币 */
  currency: string;
  /** 商品名称 */
  productName: string;
  /** 商品类型：0=普通商品，1=月卡，2=年卡.... */
  itemType: number;
  /** 0=第三方，1=官方 */
  isOfficial: number;
  /** 设备号 */
  deviceNo: string;
  /** Android:MAC地址 IOS:IDFA */
  device: string;
  /** 网络 0=wifi 1 = 3g 2=其他 */
  network: number;
  /** 机型 */
  model: string;
  /** 操作系统，例如Android4.4 */
  operatorOs: string;
  /** 游戏版本 */
  version: string;
  /** SDK版本号 */
  sdkVersion: string;
  /** 客户端提交时间 "yyyy-MM-dd hh:mm:ss" */
  clientTime: string;
  /** 额外的信息，如果是刮刮卡,它的格式是{“serialNo”:””,”pin”:””}JSON字符串 */
  exInfo: string;
  /** 参数签名结果 MD5(appId+advChannel+userId+roleId+gameOrderId+gameZoneId+code+source+channel+amount+currency+productName + exInfo +app_key)
   */
  sign: string;
}

interface StoreMap extends JSSDK.Config {
  FbLoginStatus?: Promise<fb.AuthResponse>;
  FbLogin?: Promise<fb.AuthResponse>;
  FB?: Promise<any>;
  FBInstant?: Promise<any>;
  appSecret?: string;
  user?: object;
  users?: object;
}

interface SDK {
  /**
   * 版本号
   */
  version: string;
  Login(loginParam: LoginParam): void;

  polyfilled(): void;
}

interface Product {
  amount: number;
  currency: string;
  discountDesc?: string;
  gameCoin: number;
  gameCurrency: string;
  itemType: number;
  productDesc?: string;
  productName: string;
  shortCurrency: string;
}

interface BindZoneParam {
  // userId 用户id
  userId: number;
  // gameZoneId 区服id
  gameZoneId: number;
  // createRole  是否创角 0=否 1=是
  createRole: number;
  // roleId  角色id
  roleId: number;
  // level 角色等级
  level: number;
}

interface Res {
  code: number;
  error_msg: string;
}

interface PaymentConfigRes extends Res {
  payments: PaymentChannel[];
}

interface DeviceMsg {
  gaid?: string;
  source: number;
  advChannel: number;
  network: number;
  model: string;
  operatorOs: string;
  deviceNo: string;
  device: string;
  version: string;
  sdkVersion: string;
  appId: number;
}

interface UserInfo {
  accountType: number;
  emailValid: number;
  firstLogin: number;
  userId: number;
  userName: string;
  userType: number;
  password: string;
  token: string;
}

interface UsersInfo {
  [key: string]: UserInfo;
}

interface LoginData {
  accountType: number;
  emailValid: number;
  firstLogin: number;
  userId: number;
  userName: string;
  userType: number;
  password?: string;
}

interface LoginRes extends Res {
  data: LoginData;
  firstLogin: boolean;
  token: string;
}

interface LoginParam {
  password?: string;
  userName?: string;
  nickName?: string;
  isFacebook?: boolean;
  accountType?: number;
  // 在h5游戏即web中这个参数对应查询参数advertiseId,表示一个广告位,用户注册时使用
  thirdPartyId?: string;
  email?: string;
  telephone?: string;
  userChannel?: number;
  exInfo?: string;
  birthday?: string;
  source?: number;
  appId?: number;
  /** 性别 0=男 1=女 */
  sex?: number;
  isReg?: boolean;
  userId?: number;
}

interface PaymentItem { }

interface requestParam {
  route?: string;
  method?: Methods;
  data?: object;
  url?: string;
}

// interface IntrinsicElements {
//   [elemName: string]: any;
// }

type PlatformLoginParam = LoginParam & DeviceMsg;
type Methods = "POST" | "GET";
interface UrlParams {
  appId: string;
  region: Region;
  advChannel: string;
  sdkVersion: string;
  t: string;
  debugger?: boolean;
  advertiseId?: string;
}
/* 以下为新的类型 */

