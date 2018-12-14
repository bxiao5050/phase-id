import Utils from "Base/Utils";
import Http from "Src/Base/Http";

export default class Login {
  static _ins: Login
  static get instance(): Login {
    return this._ins || new Login;
  }
  constructor() {
    Login._ins = this
  }

  private route = {
    register: "/user/v3/register",
    login: "/user/v3/login",
  }

  public platformLogin(loginParam: LoginParam): Promise<LoginRes> {
    var route
    if (loginParam.isFacebook) {
      route = this.route.register
    } else {
      if (loginParam.isReg || !loginParam.userName) {
        route = this.route.register
      }
      else {
        route = this.route.login
      }
    }

    return new Promise(async (resolve, reject) => {
      var data = await this.loginParamHandler(loginParam)
      console.log('login request', data)
      Http.instance.post({ route, data }).then((res: LoginRes) => {
        console.log('login response', res)
        switch (res.code) {
          case 200:
            RG.jssdk.SetUser(Object.assign(res.data, {
              password: data.password,
              token: res.token
            }))
            if (res.data.firstLogin) {
              RG.Mark('sdk_register')
            }
            resolve(res)
            break;
          default:
            if (res.code == 102) {
              reject(RG.jssdk.config.i18n.code102);
            } else if (res.code == 101) {
              reject(RG.jssdk.config.i18n.code101)
            } else {
              reject(res.error_msg)
            }
            break
        }
      }).catch(err => {
        reject(err)
      })
    })

  }

  public loginParamHandler(loginParam: LoginParam): Promise<PlatformLoginParam> {
    console.log('loginParamHandler', loginParam)
    // 密码md5加密
    loginParam.password = loginParam.password.length === 32 ? loginParam.password : md5(loginParam.password)
    // 获取设备信息
    return new Promise(async (resolve) => {
      // var data: JsToNativeDeviceMsg = 
      var deviceMsg: DeviceMsg = await JsToNative.getDeviceMsgAsync() as any
      // 获取签名信息
      var sign = Utils.signed({
        appId: RG.jssdk.config.appId,
        userName: loginParam.userName,
        password: loginParam.password,
        source: deviceMsg.source
      })
      loginParam.source = deviceMsg.source
      resolve(Object.assign(
        deviceMsg,
        loginParam,
        { sign }
      ))
    })

  }

  /**
   * 注册 & fb 登录
   */
  private reqRegister(loginParam: LoginParam, additional?: {
    response: any
    resolve: Function
    reject: Function
  }) {
    if (loginParam.isFacebook) {
      loginParam.userName = 'fb-' + additional.response.userID
    }

    if ('email' in additional.response) {
      loginParam.email = additional.response.email
    }
    if ('gender' in additional.response) {
      loginParam.sex = additional.response.gender === 'male' ? 0 : 1
    }
    if ('name' in additional.response) {
      loginParam.nickName = additional.response.name
    }
    if ('birthday' in additional.response) {
      loginParam.birthday = additional.response.birthday
    }
    console.log('loginParam', loginParam)
    this.platformLogin(loginParam).then(res => {
      additional.resolve(res)
    })
  }

  public facebookLogin(): Promise<LoginRes> {

    return new Promise((resolve, reject) => {
      // 登录信息
      var params: LoginParam = {
        isFacebook: true,
        userName: null,
        password: '',
        appId: RG.jssdk.config.appId,
        accountType: 2,
        thirdPartyId: '',
        email: '',
        telephone: '',
        userChannel: 0,
      }
      if (RG.jssdk.type === 4) {
        this.reqRegister(params, {
          response: {
            userID: FBInstant.player.getID() || 'test'
          }, resolve, reject
        })
      } else {
        FB.getLoginStatus(response => {
          if (response.status === "connected") {
            var userID = response.authResponse.userID
            FB.api('/me?fields=email', (response) => { // name,birthday,gender
              response.userID = userID
              console.log('response', response)
              this.reqRegister(params, { response, resolve, reject })
            })
          } else {
            if (RG.jssdk.type === 2) {
              location.href = `https://www.facebook.com/${FBVersion}/dialog/oauth?client_id=${RG.jssdk.config.FbAppID}&redirect_uri=${encodeURIComponent(location.href)}&t=${Date.now()}`
            } else {
              FB.login(response => {
                if (response.status === "connected") {
                  var userID = response.authResponse.userID
                  FB.api('/me?fields=email', (response) => { // name,birthday,gender
                    response.userID = userID
                    console.log('response', response)
                    this.reqRegister(params, { response, resolve, reject })
                  })
                } else {
                  console.error(response.status)
                }
              }, {
                  scope: 'email' // ,user_birthday,user_gender
                })
            }

          }
        })
      }


    })
  }

}