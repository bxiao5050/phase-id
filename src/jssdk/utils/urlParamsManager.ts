export class UrlParmasManager {
  private static _ins: UrlParmasManager;
  public static get instance(): UrlParmasManager {
    return this._ins || new UrlParmasManager();
  }

  private _params = {};

  constructor() {
    this._params = getUrlParams(location.href);
  }

  getUrlParam(name: string) {
    if (!name) return this._params;
    return this._params.hasOwnProperty(name) ? this._params[name] : null;
  }
}

function getUrlParams(url: string) {
  const index = url.indexOf("?") + 1;
  const str = index === 0 ? "" : url.slice(index);
  const params = {};
  if (str) {
    // 不能使用正则，可能会获取到转码后的链接中的参数;
    var arr = str.split('&');
    arr.forEach(item => {
      var arr = item.split('=');
      var key = arr[0];
      var val = arr[1];
      this._params[key] = val;
    })
  }
  return params;
}
