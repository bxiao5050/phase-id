export class UrlParmasManager {
  private static _ins: UrlParmasManager;
  public static get instance(): UrlParmasManager {
    return this._ins || new UrlParmasManager();
  }

  private _params = {};
  constructor() {
    var index = location.href.indexOf("?") + 1;
    var str = index === 0 ? "" : location.href.slice(index);
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
  }
  getUrlParam(name: string) {
    if (!name) return this._params;
    return this._params.hasOwnProperty(name) ? this._params[name] : null;
  }
}
