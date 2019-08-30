export default class Http {
  static _ins: Http
  static get instance(): Http {
    return this._ins || new Http;
  }
  private serverAddress = IS_TEST || IS_DEV ? RG.jssdk.config.server.test : RG.jssdk.config.server.formal;
  constructor() {
    Http._ins = this;
  }
  private request(param: requestParam): Promise<ServerRes> {

    let data: any
    if (param.data) {

      data = Object.keys(param.data).map(key => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(param.data[key])}`;
      }).join('&')
    }
    var xhr = new XMLHttpRequest();
    xhr.open(param.method, this.serverAddress + param.route);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var result = new Promise<ServerRes>((resolve, reject) => {
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

  public post(param: requestParam): Promise<ServerRes> {
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
