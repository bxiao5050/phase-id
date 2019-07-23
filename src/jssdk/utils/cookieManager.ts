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
