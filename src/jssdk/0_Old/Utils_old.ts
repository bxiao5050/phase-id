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

// 操作cookie的类，共有setCookie,getCookie,delCookie三个方法
export class CookieManager {
  private static _ins: CookieManager;
  public static get instance(): CookieManager {
    return this._ins || new CookieManager();
  }

  cookieMap: any = {}
  constructor() {
    CookieManager._ins = this;
    var ca = document.cookie.split(";");
    ca.forEach(item => {
      item = item.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
      var arr = item.split("=");
      var key = arr[0];
      var val = arr[1];
      this.cookieMap[key] = val;
    });
  }
  /**
    * 设置cookie
    * @param name cookie的名称
    * @param value cookie的值
    * @param exdays cookie的过期时间
    */
  public setCookie(name: string, value: string, exdays?: number): void {
    var expires: string;
    if (exdays) {
      var d: Date = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      expires = "expires=" + d.toUTCString();
    } else {
      expires = ''
    }
    this.cookieMap[name] = value;
    document.cookie = name + "=" + value + "; " + expires;
  }

  public getCookie(name?: string) {
    return this.cookieMap[name];
  }
  public delCookie(name: string) {
    this.setCookie(name, '', -1);
  };
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
  static getUrlParam = (function () {
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
    return function (name?) {
      if (name) {
        return urlParamMap.hasOwnProperty(name) ? urlParamMap[name] : null
      } else {
        return urlParamMap
      }
    }
  })()


  /** 设备参数 */
  private static _deviceType: {
    ios: boolean
    iPhone: boolean
    iPad: boolean
    android: boolean,
    win: boolean
  }

  /** 获取设备参数 */
  private static getDeviceType() {
    var u = navigator.userAgent;
    return this._deviceType = {
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
      iPad: u.indexOf('iPad') > -1,
      android: u.indexOf('Android') > -1,
      win: u.indexOf('Windows') > -1
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
    if (RG.jssdk.config.type === 2) { // 原生应用
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
    if (RG.jssdk.config.type === 2) { // 原生应用
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
    }).join('') + (RG.jssdk.config.app_key)
    return md5(data);
  }

  // 生成adjust中打点需要的设备参数
  public static generateGpsAdid(len?: number, radix?: number) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i: number;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  }

  static CookieManager: CookieManager = CookieManager.instance;
}


