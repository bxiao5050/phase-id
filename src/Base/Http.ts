import Base from "Src/Main";

export default class Http {
  static _ins: Http
  static get instance(): Http {
    return this._ins || new Http;
  }
  constructor() {
    Http._ins = this
  }

  private serverAddress = IS_TEST ? RG.jssdk.config.server.test : RG.jssdk.config.server.formal

  private request(param: requestParam): Promise<ServerRes> {
    // var mode: RequestMode
    // var options: RequestInit

    // // mode = "cors"

    // options = {
    //   method: param.method,
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    //   }
    // }

    // if (mode) {
    //   options.mode = mode
    // }

    // if (param.data) {
    //   options.body = Object.keys(param.data).map(key => {
    //     return `${key}=${param.data[key]}`
    //   }).join('&')
    // }

    // return new Promise((resolve, reject) => {
    //   fetch(param.url ? param.url : this.serverAddress + param.route, options).then(response => {
    //     return response.json()
    //   }).then(data => {
    //     resolve(data)
    //   }).catch(err => {
    //     reject(err)
    //   })
    // })

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