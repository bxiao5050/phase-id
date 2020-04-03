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

// 日志函数,如果失败收集日志方便一点
export function log(message?: any, ...optionalParams: any[]) {
  console.log(message, ...optionalParams);
  return message;
}
// 加载 js 返回 Promise<string | Event>
type loadJsParams = { url: string; id: string; };

export function loadJs({ url, id }: loadJsParams, isRepeat: boolean = false): Promise<string> {

  return new Promise((resolve, reject) => {
    if (!url) reject("loadJs url is not defined.")
    // const fjs = document.getElementsByTagName('script')[0];
    const oldjs = id ? document.getElementById(id) : null;
    if (oldjs && !isRepeat) reject("repeat load " + url);
    // 其他情况都需要加载,当需要重连老的 script 标签也在时直接删除
    if (oldjs && isRepeat) oldjs.parentNode.removeChild(oldjs);
    // 新建 script 标签
    const js = document.createElement("script");
    js.id = id;
    js.onload = function () {
      log(url + "load success");
      resolve("200");
    };
    js.onerror = function () {
      reject(url + "load error");
    }
    js.src = url;
    document.body.appendChild(js);
    // fjs.parentNode ? fjs.parentNode.insertBefore(js, fjs) : document.body.appendChild(js);
  });
}

//加载 js 实现断线重连 3 次,三次后直接失败弹出 alert 网络错误 Network Error
export async function loadJsRepeat(params: loadJsParams, num: number = 3): Promise<string> {

  num--;
  let result = await loadJs(params).catch((err: string) => log(err));
  if (result === '200' || num <= 0) return result;

  return await loadJsRepeat(params, num);
}
// 获取 h5 游戏的首页的 origin
export function getUrlOrigin(url: string) {
  const arr = /(http|https):\/\/(www.)?([A-Za-z0-9-_]+(\.)?)+/.exec(url);
  return arr && arr[0];
}
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
export function getAccountType(userType: number, accountType: number) {
  if (userType === 0) return "guest";
  if (accountType === 2) return "fb";
  return "sdk";
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
// 获取参数类型 'Null' Undefined Math Object Array String Arguments Function  Error  Boolean Number Date RegExp
export function getClass(a: any) {
  const str = Object.prototype.toString.call(a)
  return /^\[object (.*)\]$/.exec(str)[1]
}
/* 获取网络类型 */
export function getNetworkType() {
  var ua = navigator.userAgent;
  var networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
  networkStr = networkStr.toLowerCase().replace('nettype/', '');
  var result: number;
  /* 网络 0=wifi 1 = 3g 2=其他  4g直接按3g*/
  switch (networkStr) {
    case 'wifi':
      result = 0;
      break;
    case '4g':
      result = 1;
      break;
    case '3g':
      result = 1;
      break;
    case '3gnet':
      result = 1;
      break;
    default:
      result = 2;
  }
  return result;
}
// 获取手机的设备类型和操作系统
export function getOsAndModel() {
  // http://hgoebl.github.io/mobile-detect.js/
  let MobileDetect: any; //这里使用的是一个外部库，如要使用，请加载MobileDetect
  //判断数组中是否包含某字符串
  const contains = function (needle, that) {
    for (i in that) {
      if (that[i].indexOf(needle) > 0)
        return i;
    }
    return -1;
  }

  var device_type = navigator.userAgent;//获取userAgent信息
  document.write(device_type);//打印到页面
  var md = new MobileDetect(device_type);//初始化mobile-detect
  var os = md.os();//获取系统
  var model = "";
  if (os == "iOS") {//ios系统的处理
    os = md.os() + md.version("iPhone");
    model = md.mobile();
  } else if (os == "AndroidOS") {//Android系统的处理
    os = md.os() + md.version("Android");
    var sss = device_type.split(";");
    var i = contains("Build/", sss);
    if (i > -1) {
      model = sss[i].substring(0, sss[i].indexOf("Build/"));
    }
  }
  alert(os + "---" + model);//打印系统版本和手机型号
  /* 作者：昕鸿
  来源：CSDN
  原文：https://blog.csdn.net/szs860806/article/details/70316556
  版权声明：本文为博主原创文章，转载请附上博文链接！ */
}
export function getParameterByName(name: string) {
  const key = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};
export function getObjectKeyValueStr(pre: string = '', connector: string = ',', func: (str: any) => string, obj: { [key: string]: any }) {
  var str = pre;
  Object.keys(obj).forEach(key => str += `${func(key)}=${func(obj[key])}${connector}`);
  return str.length === pre.length ? '' : str.slice(0, str.length - 1);
}

export function getUrlParams(url: string) {

  let result: { [key: string]: string } = {};
  if (url.indexOf('?') !== -1) {
    url.slice(url.indexOf('?') + 1).split(/&/)
      .forEach(item => (result[decodeURIComponent(item.split(/=/)[0])] = decodeURIComponent(item.split(/=/)[1])));
  }
  return result;
}

export function getUrlParamsStr(obj: { [key: string]: any }) {

  return getObjectKeyValueStr('?', '&', encodeURIComponent, obj);
}

export function replaceUrlToHttps(url: string): string {
  return url.replace(/http\:\/{0,2}/, 'https://').replace(/\:\d{1,10}/, '').replace(/:[0-9]+/, '');
}
/* 错误处理函数 */
export function errorHandle(lang: any) {
  return function (code: number): string {
    switch (code) {
      case 102:
        return "用户已存在";

      default:
        return;
    }
  }
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
//参数签名
export function signed(params: (string | number)[]): string {
  // 参数签名不能用对象，有顺序，使用数组
  // var paramskeys = Object.keys(params)
  // var data = params.map(key => {
  //   return params[key]
  // }).join('') + (RG.jssdk.config.app_key)
  return md5(params.join(""));
}