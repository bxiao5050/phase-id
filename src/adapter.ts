export function checkJsToNative() {
  if (!window.JsToNative) {
    let Fn = function () { }
    window.JsToNative = {
      getDeviceMsg: function () {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        var source = isAndroid ? 1 : isiOS ? 0 : 3
        return JSON.stringify({
          appId: RG.jssdk.config.appId,
          advChannel: RG.jssdk.config.advChannel,
          source: source,
          network: 0,
          model: '0',
          operatorOs: '0',
          deviceNo: '0',
          device: '0',
          version: '0',
          sdkVersion: '0',
        })
      },
      getDeviceMsgAsync: function () {
        return new Promise(resolve => {
          resolve(JSON.parse(window.JsToNative.getDeviceMsg()))
        })
      },
      init: Fn,
      gameEvent: Fn,
      jpwork: Fn,
      consumeOrder: Fn,
      exitApp: Fn,
    }
  }
}