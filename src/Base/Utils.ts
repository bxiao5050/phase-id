Date.prototype.format = function (fmt) { // author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

class TimeManager {
  private static _ins: TimeManager
  public static get instance(): TimeManager {
    return this._ins || new TimeManager
  }
  constructor() {
    TimeManager._ins = this
  }

  /**
   * 返回当前时间戳 毫秒数
   */
  public get dateNow() {
    return Date.now()
  }
}


export default class Utils {

  static getAccountType = (userType, accountType) => {
    if (accountType === 2) {
      return "fb";
    } else {
      if (userType === 0) {
        return "guest";
      }
    }
    return "sdk";
  }

  /**
   * @param name 获取url中参数函数
   */
  static getParameterByName = (function () {
    var urlParamMap = {}
    var interrogationIndex = location.href.indexOf("?") + 1
    var str = interrogationIndex === 0 ? "" : location.href.slice(interrogationIndex)
    if (str) {
      var arr = str.split(/&|%26/)
      arr.forEach(item => {
        var arr = item.split(/=|%3D/)
        var key = arr[0]
        var val = arr[1]
        urlParamMap[key] = val
      })
    }
    return function (name) {
      return urlParamMap.hasOwnProperty(name) ? urlParamMap[name] : null
    }
  })()


  /** 设备参数 */
  private static _deviceType: {
    ios: boolean
    iPhone: boolean
    iPad: boolean
    android: boolean
  }

  /** 获取设备参数 */
  private static getDeviceType() {
    var u = navigator.userAgent;
    return this._deviceType = {
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
      iPad: u.indexOf('iPad') > -1,
      android: u.indexOf('Android') > -1
    }
  }
  public static get deviceType() {
    return this._deviceType || this.getDeviceType()
  }

  /** 设备信息 */
  public static _deviceMsg: DeviceMsg
  /** 初始化设备信息 */
  public static async initDeviceMsg() {
    // console.log('initDeviceMsg')
    var info = {
      source: 0,
      advChannel: RG.jssdk.config.advChannel,
      network: 0,
      model: '0',
      operatorOs: '0',
      deviceNo: '0',
      device: '0',
      version: '0',
      sdkVersion: '0',
      appId: RG.jssdk.config.appId
    }
    if (RG.jssdk.type === 2) { // 原生应用
      var deviceMsg = await JsToNative.getDeviceMsgAsync()
      // console.log('it is native deviceMsg and msg is ', deviceMsg)
      info.device = deviceMsg.device
      info.deviceNo = deviceMsg.deviceNo
      info.version = deviceMsg.version
      info.model = deviceMsg.model
      info.operatorOs = deviceMsg.operatorOs
      info.source = deviceMsg.source
      info.network = deviceMsg.network
    } else { // web 端应用
      if (Utils.deviceType.ios || Utils.deviceType.iPhone || Utils.deviceType.iPad) {
        info.source = 0;
        info.deviceNo = "IDFV";
        info.device = "IDFV";
      } else if (Utils.deviceType.android) {
        info.source = 1;
        info.deviceNo = "IMEI";
        info.device = "MAC#ANDRIDID";
      } else {
        info.source = 3;
      }
    }
    this._deviceMsg = info
  }

  public static async refetchDeviceMsg() {
    if (RG.jssdk.type === 2) { // 原生应用
      var deviceMsg = await JsToNative.getDeviceMsgAsync()
      this._deviceMsg.network = deviceMsg.network
    }
  }

  public static get deviceMsg(): DeviceMsg {
    if (this._deviceMsg) {
      this.refetchDeviceMsg()
    } else {
      this.initDeviceMsg()
    }
    console.log('get deviceMsg', this._deviceMsg.network)
    return this._deviceMsg
  }

  //参数签名
  public static signed(params) {
    var paramskeys = Object.keys(params)
    var data = paramskeys.map(key => {
      return params[key]
    }).join('') + (RG.jssdk.config.appKey)
    return md5(data);
  }

  static TimeManager: TimeManager = TimeManager.instance

}


