type Method = "POST" | "GET";
type CommonParams = { route: string; data?: object };
type RequestParams = CommonParams & { method: Method };

export default class Http {
  static _ins: Http;
  static get ins(): Http {
    return this._ins || new Http();
  }
  constructor() {
    Http._ins = this;
  }
  private serverAddress: string = SERVER + "/pocketgames/client";

  private request(param: RequestParams): Promise<any> {
    let data: any;
    if (param.data) {
      data = Object.keys(param.data)
        .map(key => `${key}=${param.data[key]}`)
        .join("&");
    }
    var xhr = new XMLHttpRequest();
    xhr.open(param.method, this.serverAddress + param.route);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var result = new Promise((resolve, reject) => {
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject("server res err");
          }
        }
      };
    });
    xhr.send(data);
    return result;
  }

  public post<T extends ServerRes>(param: {route: string;data?: object;}): Promise<T> {
    const data: RequestParams = {
      method: "POST",
      route: param.route,
      data: param.data
    };
    return this.request(data);
  }

  public get<T extends ServerRes>(param:  {route: string;data?: object;}): Promise<T> {
    const data: RequestParams = {
      method: "GET",
      route: param.route,
      data: param.data
    };
    return this.request(data);
  }
}

// http://127.0.0.1:7001/index.html?appId=10062&advChannel=1&sdkVersion=v3.0.0&region=test
