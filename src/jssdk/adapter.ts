export function checkJsToNative(appId: string, advChannel: string) {
  if (!(window.JsToNative || window['webkit'])) {
    let Fn = function () { console.log('adapter------'); console.log(arguments) }
    window.JsToNative = {
      getDeviceMsg: function () {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        // 0 ios 1 android 2 网页支付 3web端不区分移动端和pc端
        var source = isAndroid ? 1 : isiOS ? 0 : 3;
        return JSON.stringify({
          appId,
          advChannel,
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
          console.log("adapter")
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
