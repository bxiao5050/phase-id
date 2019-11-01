export default class Http {
  static _ins: Http
  static get instance(): Http {
    return this._ins || new Http;
  }
  // private serverAddress = IS_TEST || IS_DEV ? RG.jssdk.config.server.test : RG.jssdk.config.server.formal;
  private serverAddress: string;
  constructor() {
    Http._ins = this;
  }
  init(region?: Region) {
    const regions = {
      sg: 'https://sdk-sg.pocketgamesol.com',
      de: 'https://sdk-de.pocketgamesol.com',
      vn: 'https://sdk-vn.pocketgamesol.com',
      test: 'https://sdk-test.changic.net.cn'
    }
    const key = IS_TEST ? "test" : (region || window.RG.jssdk.config.region);
    this.serverAddress = regions[key] + "/pocketgames/client";
  }

  private request(param: requestParam): Promise<Res> {

    let data: any
    if (param.data) {

      data = Object.keys(param.data).map(key => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(param.data[key])}`;
      }).join('&')
    }
    var xhr = new XMLHttpRequest();
    xhr.open(param.method, this.serverAddress + param.route);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var result = new Promise<Res>((resolve, reject) => {
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject("server res err");
          }
        }
      }
    })
    xhr.send(data);

    return result;
  }

  public post(param: requestParam): Promise<any> {
    return this.request(
      Object.assign({ method: 'POST' }, param)
    )
  }

  public get(param: requestParam = {}) {
    return this.request(
      Object.assign({ method: 'GET' }, param)
    )
  }

}
