/* main.ts 中 initDebugger 引入的日志查看插件的全局变量 */
declare const VConsole: any;
/* adjust 打点的 jssdk 暂时未使用 */
declare const Adjust: any;
/* 地址栏参数 */
interface UrlParams {
  appId: string;
  advChannel: string;
  sdkVersion: string;
  debugger?: string;
  /* web端的投放的广告参数 */
  advertiseId?: string;
  /* 微端 fb 登录参数 */
  code?: string;
  [key: string]: string;
}

interface Config {
  /* 后端加密参数 */
  appKey: string;
  /* 现在仅 quick 有 */
  appSecret?: string;
  /* facebook appId */
  fbAppId: string;
  /* sdk 语言 */
  language: string;
  // 悬浮球距离顶边的距离rem
  hoverTop: string;
  // 悬浮球是在左边还是右边
  hoverFromLeft: boolean;
  /* 是否官方支付打点 */
  isPurchasedMark: boolean;
  /* 粉丝页地址 */
  fans: string;
  /* facebook messager 在 pc端和移动端对应的页面 */
  fbMessengerPc?: string;
  fbMessengerMb?: string;
  /* 仅web端需要 */
  /* 游戏名, */
  name?: string;
  /* ios下载包下载地址 */
  iosDonloadUrl?: string;
  /* android 微端包下载地址 */
  androidDonloadUrl?: string;
  /* 公司自己开发游戏的首页的地址 如: https://www.narutoh5game.com/h5-plays/index.html*/
  indexUrl?: string;
  /* adjust 打点,原生端有 */
  adjustId?: string;
  /* adjust 打点的所有的 token */
  adjustToken?: {
    [key: string]: string;
  };
  /* 对固定点点名的适配 */
  markName?: {
    /* sdk加载完成 */
    sdk_loaded: string;
    /* 购买点 */
    sdk_purchased_done: string;
    /* 注册点 */
    sdk_register: string;
    /* 联系客服 */
    sdk_contact_us: string;
  };
/* quick 参数 */
productCode?: string,
productKey?: string,
}
interface ExtendedConfig extends Config {
  /* sdk 类型 */
  type: number;
  /* 地址栏参数 */
  urlParams: UrlParams;
  /* 语言包 */
  i18n: I18n;
  /* facebook jssdk 是否加载完成 */
  fb_sdk_loaded: boolean;
}

interface Window {
  /* facebook 初始化函数 */
  fbAsyncInit?(): void;
  /* 登录完成通知游戏的回调 */
  rgAsyncInit: Function;
}
interface I18n {
  UnknownErr: string;
  msg001: string;
  errMsg001: string;
  errMsg002: string;
  code101: string;
  code102: string;
  dom001: string;
  dom002: string;
  dom003: string;
  dom004: string;
  dom005: string;
  dom007: string;
  dom008: string;
  dom009: string;
  dom010: string;
  dom011: string;
  dom012: string;
  dom014: string;

  PayCenter: string;
  Purchase: string;
  tuichu: string;
  winopen: string;
  jump: string;
  loadException: string;
  loading: string;
  // ——————————————————————————————————————————————————————
  // txt_charge_num_tips: string;
  // txt_charge_way_tips: string;
  // txt_other_way: string;
  // txt_official: string;
  // txt_order_num_tips: string;
  // txt_charge_status_tips: string;
  // net_error_203: string;
  // txt_safe_set: string;
  // txt_check_charge: string;
  // txt_account_name: string;
  // txt_device_num: string;
  // float_button_user_center: string;
  // p2refresh_end_no_records: string;
  // float_button_service: string;
  // float_button_bind_account: string;
  // txt_change_psw: string;
  // net_error_30200: string;
}
