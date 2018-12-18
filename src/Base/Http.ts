import Base from "Src/Main";
import Utils from "./Utils";

export default class Http {
  static _ins: Http
  static get instance(): Http {
    return this._ins || new Http;
  }
  constructor() {
    Http._ins = this
  }

  private serverAddress = (Utils.getUrlParam('debugger') || window['debugger']) ? RG.jssdk.config.server.test : RG.jssdk.config.server.formal

  private request(param: requestParam): Promise<ServerRes> {
    var data
    if (param.data) {
      data = Object.keys(param.data).map(key => {
        return `${key}=${param.data[key]}`
      }).join('&')
    }

    var xhr = new XMLHttpRequest();//创建ajax对象
    xhr.open(param.method, this.serverAddress + param.route)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(data)

    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = function () {
        //xhr.readyState  //浏览器和服务器，进行到哪一步了。
        //0->（未初始化）：还没有调用 open() 方法。
        //1->（载入）：已调用 send() 方法，正在发送请求。
        //2->载入完成）：send() 方法完成，已收到全部响应内容。
        //3->（解析）：正在解析响应内容。
        //4->（完成）：响应内容解析完成，可以在客户端调用。
        if (xhr.readyState === 4) {
          if (xhr.status === 200) { //判断是否成功,如果是200，就代表成功
            // console.log('server res', xhr.responseText)
            resolve(JSON.parse(xhr.responseText))
          } else {
            reject("server res err");
          }
        }
      }
    })

  }

  public post(param: requestParam): Promise<ServerRes> {
    return this.request(
      Object.assign({ method: 'POST' }, param)
    )
  }

  public get(param?: requestParam) {
    return this.request(
      Object.assign({ method: 'GET' }, param || {})
    )
  }




}