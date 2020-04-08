import {toJSONSchema} from 'mockjs';

export default class AndroidApi {
  /* FB 是否已经挪移到原生,兼容老包代码 */
  get hasFbLogin() {
    return window.JsToNative.fbLogin ? true : false;
  }
  get hasFbShare() {
    return window.JsToNative.fbShare ? true : false;
  }
  constructor() {
    if (!window.JsToNative) checkJsToNative();
  }
  /* 初始化官方支付,或者支付插件 */
  init(params: JsToNativeInitParams) {
    console.log('JsToNative:: init', params);
    window.JsToNative.init(JSON.stringify(params));
  }
  /* 微端打点 */
  gameEvent(params: GameEventParam) {
    console.log('JsToNative:: gameEvent', params);
    window.JsToNative.gameEvent(JSON.stringify(params));
  }
  /* 调起官方支付 */
  jpwork(params: JpworkParams) {
    console.log('JsToNative:: jpwork', params);
    window.JsToNative.jpwork(JSON.stringify(params));
  }
  /* 消单 */
  consumeOrder(params: ConsumeOrderParams) {
    console.log('JsToNative:: consumeOrder', params);
    window.JsToNative.consumeOrder(JSON.stringify(params));
  }
  /* 退出游戏 */
  exitApp() {
    console.log('JsToNative:: exitApp');
    window.JsToNative.exitApp();
  }
  /* 获取设备信息 */
  getDeviceMsg(): Promise<DeviceMsg> {
    console.log('JsToNative:: getDeviceMsg');
    let msg = JSON.parse(window.JsToNative.getDeviceMsg());
    console.log('JsToNative:: getDeviceMsg result:', msg);
    return Promise.resolve(msg);
  }
  /* facebook 登录 */
  fbLoginResolve: Function;
  fbLoginPromise: Promise<FbLoginRes>;
  fbLogin(): Promise<FbLoginRes> {
    console.log('JsToNative:: facebook login');
    if (!this.fbLoginPromise) {
      this.fbLoginPromise = new Promise(resolve => {
        this.fbLoginResolve = resolve;
        window.JsToNative.fbLogin();
      });
    }
    return this.fbLoginPromise;
  }
  /* facebook 分享 */
  fbShareResolve: Function;
  fbSharePromise: Promise<FbShareRes>;
  fbShare(url: string, type?: any): Promise<FbShareRes> {
    console.log('JsToNative:: fbShare url: ' + url);
    if (!this.fbSharePromise) {
      this.fbSharePromise = new Promise(resolve => {
        this.fbShareResolve = resolve;
        window.JsToNative.fbShare(JSON.stringify({url}));
      });
    }
    return this.fbSharePromise;
  }
}

function checkJsToNative() {
  let Fn: any = function() {};
  window.JsToNative = {
    getDeviceMsg: function() {
      let msg = {
        source: 3,
        network: 0,
        model: '0',
        operatorOs: '0',
        deviceNo: '0',
        device: '0',
        version: '0'
      };
      return JSON.stringify(msg);
    },
    init: Fn,
    gameEvent: Fn,
    jpwork: Fn,
    consumeOrder: Fn,
    exitApp: Fn
    //fbLogin: Fn,
    //fbShare: Fn
  };
}
/* 在 微端 window上挂载的方法 */
declare global {
  interface Window {
    JsToNative?: {
      init(params: string): void;
      gameEvent(params: string): void;
      consumeOrder(params: string): void;
      exitApp(): void;
      jpwork(params: string): void;
      fbLogin?(): void;
      fbShare?(url: string): void;
      getDeviceMsg(): string;
    };
  }
}
export interface DeviceMsg {
  gaid?: string;
  source: number;
  network: number;
  model: string;
  operatorOs: string;
  deviceNo: string;
  device: string;
  version: string;
}
export interface FbLoginRes {
  userId: string;
  userName: string;
  password: string;
  nickName: string;
  email: string;
  /* 微端参数传入 exInfo 中 */
  mapping?: string;
  accountType: number;
  userChannel: number;
}
export interface FbShareRes {
  code: number;
  /* 成功的参数 */
  userId?: string;
  nickName?: string;
  email?: string;
  postId?: string;
  /* 失败的参数 */
  error_msg?: string;
  /* 取消只有code 为 401 */
}
export interface JsToNativeInitParams {
  appId: number;
  advChannel: number;
  gpProduct: string;
  gpVerify: string;
  gpPluginAction: string;
  gpPluginGpUrl: string;
  gpPluginType: string;
  gpPluginName: string;
  gpPluginLoadingUrl: string;
}
export interface GameEventParam {
  /* facebook */
  eventName: string;
  /* adjust */
  eventToken?: string;
  /* 支付点 */
  currency?: string;
  money?: string;
  userId?: number;
  gameOrderId?: string;
}
export interface JpworkParams {
  productName: string;
  transactionId: string;
  channel: number;
  currency: string;
  money: number;
  userId: number;
}
export interface ConsumeOrderParams {
  code: number;
  exInfo: string;
  error_msg?: string;
}
