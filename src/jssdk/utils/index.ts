// 获取设备类型
export function getDeviceType() {
  const u = navigator.userAgent;
  return {
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
    iPad: u.indexOf('iPad') > -1,
    android: u.indexOf('Android') > -1,
    win: u.indexOf('Windows') > -1
  };
}
// 获取选择用户时的用户类型
export function getAccountType(userType: UserType, accountType: AccountType) {
  if (accountType === 2) return "fb";
  if (userType === 0) return "guest";
  return "sdk";
}

//参数签名
export function signed(params: (string | number)[]): string {
  // 参数签名不能用对象，有顺序，使用数组
  // var paramskeys = Object.keys(params)
  // var data = params.map(key => {
  //   return params[key]
  // }).join('') + (RG.jssdk.config.app_key)
  return md5(params.join(""));
}

// 生成唯一的设备id
export function generateGpsAdid(len?: number, radix?: number) {
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

// 格式化时间"yyyy-MM-dd hh:mm:ss"
export function formatDate(fmt: string = "yyyy-MM-dd hh:mm:ss", date: Date = new Date()) {
  if (!(date instanceof Date)) throw "date is not Date instance";
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
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

export const getUrlParam = (function () {
  var urlParamMap = {};
  var interrogationIndex = location.href.indexOf("?") + 1;
  var str = interrogationIndex === 0 ? "" : location.href.slice(interrogationIndex);
  if (str) {
    // 不匹配str.split(/&|%26/)，地址栏转义后的参数
    var arr = str.split(/&/);
    arr.forEach(item => {
      const arr = item.split(/=/);
      urlParamMap[decodeURIComponent(arr[0])] = decodeURIComponent(arr[1]);
    })
  }
  return function (name) {
    return urlParamMap.hasOwnProperty(name) ? urlParamMap[name] : null;
  }
})()

