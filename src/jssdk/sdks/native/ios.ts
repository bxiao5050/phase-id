import {
  JsToNativeInitParams,
  GameEventParam,
  JpworkParams,
  ConsumeOrderParams,
  FbLoginRes,
  FbShareRes,
  DeviceMsg
} from './android';

export default class IosApi {
  /* FB 是否已经挪移到原生,兼容老包代码 */
  get hasFbLogin() {
    return window.webkit.messageHandlers.fbLogin ? true : false;
  }
  get hasFbShare() {
    return window.webkit.messageHandlers.fbShare ? true : false;
  }
  constructor() {
    if (!window.JsToNative) checkWK();
  }
  /* 初始化官方支付,或者支付插件 */
  init(params: JsToNativeInitParams) {
    console.log('JsToNative:: init', params);
    window.webkit.messageHandlers.init.postMessage(JSON.stringify(params));
  }
  /* 微端打点 */
  gameEvent(params: GameEventParam) {
    console.log('JsToNative:: gameEvent', params);
    window.webkit.messageHandlers.gameEvent.postMessage(JSON.stringify(params));
  }
  /* 调起官方支付 */
  jpwork(params: JpworkParams) {
    console.log('JsToNative:: jpwork', params);
    window.webkit.messageHandlers.jpwork.postMessage(JSON.stringify(params));
  }
  /* 消单 */
  consumeOrder(params: ConsumeOrderParams) {
    console.log('JsToNative:: consumeOrder', params);
    window.webkit.messageHandlers.consumeOrder.postMessage(JSON.stringify(params));
  }
  /* 退出游戏 */
  exitApp() {
    console.log('JsToNative:: exitApp');
    window.webkit.messageHandlers.exitApp.postMessage(null);
  }
  /* 获取设备信息 */
  deviceMsgResolve: Function;
  deviceMsgPromise: Promise<DeviceMsg>;
  getDeviceMsg(): Promise<DeviceMsg> {
    console.log('JsToNative:: getDeviceMsg');
    if (!this.deviceMsgPromise) {
      this.deviceMsgPromise = new Promise(resolve => {
        this.deviceMsgResolve = resolve;
        window.webkit.messageHandlers.getDeviceMsg.postMessage(null);
      });
    }
    return this.deviceMsgPromise;
  }
  /* facebook 登录 */
  fbLoginResolve: Function;
  fbLoginPromise: Promise<FbLoginRes>;
  fbLogin(): Promise<FbLoginRes> {
    console.log('JsToNative:: facebook login');
    if (!this.fbLoginPromise) {
      this.deviceMsgPromise = new Promise(resolve => {
        this.fbLoginResolve = resolve;
        window.webkit.messageHandlers.fbLogin.postMessage(null);
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
        window.webkit.messageHandlers.fbShare.postMessage(null);
      });
    }
    return this.fbSharePromise;
  }
}

declare global {
  interface Window {
    webkit?: {
      messageHandlers: {
        getDeviceMsg: {
          postMessage: PostMessage;
        };
        init: {
          postMessage: PostMessage;
        };
        gameEvent: {
          postMessage: PostMessage;
        };
        jpwork: {
          postMessage: PostMessage;
        };
        consumeOrder: {
          postMessage: PostMessage;
        };
        exitApp: {
          postMessage: PostMessage;
        };
        fbLogin?: {
          postMessage: PostMessage;
        };
        fbShare?: {
          postMessage: PostMessage;
        };
      };
    };
  }
}
type PostMessage = (params: null | string) => void;
/* ios ,模拟实现 */
function checkWK() {
  window.webkit = {
    messageHandlers: {
      getDeviceMsg: {
        postMessage: function() {
          window.NativeToJs.deviceMsg({
            source: 3,
            network: 0,
            model: '0',
            operatorOs: '0',
            deviceNo: '0',
            device: '0',
            version: '0'
          });
        }
      },
      init: {
        postMessage: function(params: string) {
          console.log(params);
        }
      },
      gameEvent: {
        postMessage: function(params: string) {
          console.log(params);
        }
      },
      jpwork: {
        postMessage: function(params: string) {
          console.log(params);
        }
      },
      consumeOrder: {
        postMessage: function(params: string) {
          console.log(params);
        }
      },
      exitApp: {
        postMessage: function(params: string) {
          console.log(params);
        }
      }
      // fbLogin?:{
      //   postMessage: function (params:string) {
      //     console.log(params);
      //   }
      // },
      // fbShare?:{
      //   postMessage:function (params:string) {
      //     console.log(params);
      //   }
      // }
    }
  };
}
