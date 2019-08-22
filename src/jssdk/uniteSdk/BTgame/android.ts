import { UniteSdk } from './UniteSdk';

export default class AndroidSdk extends UniteSdk {
  constructor(config: any) {
    super(config)
  }
  /* @overwrite UniteSdk  initGetDeviceMsgAsync*/
  initGetDeviceMsgAsync() {
    window.JsToNative.getDeviceMsgAsync = () => {
      if (!RG.jssdk.deviceMsgPromise) {
        RG.jssdk.deviceMsgPromise = new Promise(resolve => {
          RG.jssdk.deviceMsgResolve = resolve
        })
        setTimeout(function () {
          let data = JSON.parse(window.JsToNative.getDeviceMsg())
          data = Object.assign(data, {
            advChannel: RG.jssdk.config.advChannel,
            appId: RG.jssdk.config.appId
          })

          RG.jssdk.deviceMsgResolve(data)
          RG.jssdk.deviceMsgPromise = null
        })
      }
      return RG.jssdk.deviceMsgPromise
    }
    /**
    * 全局变量初始化
    */
    window.NativeToJs = {
      consumeOrder: () => { },
      jpworkResult: () => { },
      goBack: this.goBack,
      deviceMsg: this.gotDeviceMsg
    }
  }
}
