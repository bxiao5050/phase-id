import { UniteSdk } from './UniteSdk';

export default class IosSdk extends UniteSdk {
  constructor(config: any) {
    super(config)
  }
  /* @overwrite UniteSdk  initGetDeviceMsgAsync*/
  initGetDeviceMsgAsync() {
    const WK = window['webkit']
    window.JsToNative = {
      getDeviceMsgAsync: function () {
        if (!RG.jssdk.deviceMsgPromise) {
          RG.jssdk.deviceMsgPromise = new Promise(resolve => {
            RG.jssdk.deviceMsgResolve = resolve
          })
          WK.messageHandlers.getDeviceMsg.postMessage(null)
        }
        return RG.jssdk.deviceMsgPromise
      },
      init: function (param: string) {
        WK.messageHandlers.init.postMessage(param)
      },
      gameEvent: function (param: string) {
        console.log('gameEvent', param)
        WK.messageHandlers.gameEvent.postMessage(param)
      },
      jpwork: function (param: string) {
        WK.messageHandlers.jpwork.postMessage(param)
      },
      consumeOrder: function (param: string) {
        WK.messageHandlers.consumeOrder.postMessage(param)
      },
      exitApp: function () {
        WK.messageHandlers.exitApp.postMessage(null)
      }
    } as any;
    /* 初始化NativeToJs */
    window.NativeToJs = {
      consumeOrder: () => { },
      jpworkResult: () => { },
      goBack: this.goBack,
      deviceMsg: this.gotDeviceMsg
    }
  }
}
