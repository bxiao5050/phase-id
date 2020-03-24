import {getUrlParam, signed} from '../common/utils';
import Http from './Http';
import Account from './Account';

export default class Login {
  static _ins: Login;
  static get instance(): Login {
    return this._ins || new Login();
  }
  constructor() {
    Login._ins = this;
  }

  private route = {
    register: '/user/v3/register',
    login: '/user/v3/login'
  };

  public platformLogin(loginParam: LoginParam): Promise<LoginRes> {
    var route,
      isRegister = false;
    if (loginParam.isFacebook) {
      route = this.route.register;
      isRegister = true;
    } else {
      if (loginParam.isReg || !loginParam.userName) {
        route = this.route.register;
        isRegister = true;
      } else {
        route = this.route.login;
      }
    }
    return new Promise(async (resolve, reject) => {
      var data = await this.loginParamHandler(loginParam, isRegister);
      Http.ins
        .post({route, data})
        .then((res: LoginRes) => {
          switch (res.code) {
            case 200:
              RG.jssdk.Account.user = Object.assign(res.data, {
                password: data.password,
                token: res.token
              });
              if (res.data.firstLogin) {
                RG.Mark('sdk_register');
              }
              resolve(res);
              break;
            default:
              if (res.code == 102) {
                reject(RG.jssdk.config.i18n.code102);
              } else if (res.code == 101) {
                reject(RG.jssdk.config.i18n.code101);
              } else {
                reject(res.error_msg);
              }
              break;
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public loginParamHandler(
    loginParam: LoginParam,
    isRegister: boolean
  ): Promise<PlatformLoginParam> {
    // 密码md5加密
    loginParam.password =
      loginParam.password.length === 32 ? loginParam.password : md5(loginParam.password);
    // 获取设备信息
    return new Promise(async resolve => {
      var deviceMsg: DeviceMsg = (await JsToNative.getDeviceMsgAsync()) as any;
      // 获取签名信息
      var sign = signed([
        RG.jssdk.config.appId,
        loginParam.userName,
        loginParam.password,
        deviceMsg.source,
        RG.jssdk.config.app_key
      ]);
      loginParam.source = deviceMsg.source;
      if (RG.jssdk.config.type === 1 && isRegister) {
        loginParam.thirdPartyId = getUrlParam('advertiseId') ? getUrlParam('advertiseId') : '';
      }
      resolve(Object.assign(deviceMsg, loginParam, {sign}));
    });
  }

  /**
   * 注册 & fb 登录
   */
  private reqRegister(
    loginParam: LoginParam,
    additional?: {
      response: any;
      resolve: Function;
      reject: Function;
    }
  ) {
    if (loginParam.isFacebook) {
      loginParam.userName = 'fb-' + additional.response.userID;
    }

    if ('email' in additional.response) {
      loginParam.email = additional.response.email;
    }
    if ('gender' in additional.response) {
      loginParam.sex = additional.response.gender === 'male' ? 0 : 1;
    }
    if ('name' in additional.response) {
      loginParam.nickName = additional.response.name;
    }
    if ('birthday' in additional.response) {
      loginParam.birthday = additional.response.birthday;
    }
    this.platformLogin(loginParam).then(res => {
      additional.resolve(res);
    });
  }

  public facebookLogin(): Promise<LoginRes> {
    if (getItem(`fblo_${RG.jssdk.config.fb_app_id}`)) {
      document.cookie =
      `fblo_${RG.jssdk.config.fb_app_id}` +
      `=n;expires=${new Date(Date.now() + 1000000)};domain=.www.narutoh5game.com; path=/`;
    }
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
        userChannel: 0
      };
      if (RG.jssdk.config.type === 4) {
        this.reqRegister(params, {
          response: {
            userID: FBInstant.player.getID() || 'test'
          },
          resolve,
          reject
        });
      } else {
        FB.getLoginStatus(_res => {
          let response = _res.authResponse;
          if (response && response.userID) {
            if (getItem(`fblo_${RG.jssdk.config.fb_app_id}`)) {
              document.cookie =
                `fblo_${RG.jssdk.config.fb_app_id}` +
                `=y;expires=${new Date(Date.now() + 1000000)};domain=.www.narutoh5game.com; path=/`;
            }
            var userID = response.userID;
            FB.api('/me?fields=public_profile,email', response => {
              // name,birthday,gender
              response.userID = userID;
              this.reqRegister(params, {response, resolve, reject});
            });
            // this.reqRegister(params, { response, resolve, reject })
          } else {
            if (RG.jssdk.config.type === 2) {
              let index = location.href.indexOf('&code=');
              let url = index === -1 ? location.href : location.href.substr(0, index);
              location.href = `https://www.facebook.com/${FBVersion}/dialog/oauth?client_id=${
                RG.jssdk.config.fb_app_id
              }&redirect_uri=${encodeURIComponent(url)}&t=${Date.now()}`;
            } else {
              FB.login(
                _res => {
                  if (_res.status === 'connected') {
                    this.reqRegister(params, {response: _res.authResponse, resolve, reject});
                    // var userID = response.authResponse.userID
                    // FB.api('/me?fields=email', (response) => { // name,birthday,gender
                    //   response.userID = userID
                    //   this.reqRegister(params, { response, resolve, reject })
                    // })
                  } else {
                    console.error(_res.status);
                  }
                },
                {
                  scope: 'public_profile,email' // ,user_birthday,user_gender
                }
              );
            }
          }
        });
        // let response = FB.getAuthResponse()
      }
    });
  }
}

function getItem(sKey) {
  return (
    decodeURIComponent(
      document.cookie.replace(
        new RegExp(
          '(?:(?:^|.*;)\\s*' +
            encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') +
            '\\s*\\=\\s*([^;]*).*$)|^.*$'
        ),
        '$1'
      )
    ) || null
  );
}
// interface LoginBaseParams {
//   appId: number;
//   source: SourceType;
//   advChannel: number;
//   network: NetWork;
//   model: string;
//   operatorOs: string;
//   deviceNo: string;
//   device: string;
//   version: string;
//   sdkVersion: string;
// }
// interface RegisterRemainingParams {
//   nickName?: string;
//   accountType: AccountType;
//   thirdPartyId?: string;
//   sex?: Sex;
//   birthday?: string;
//   email?: string;
//   telephone?: string;
//   userChannel: UserChannel;
// }
// // 注册的参数
// type RegisterParams = LoginParam & RegisterRemainingParams;
// interface LoginAndRegisterRes extends ServerRes {
//   data: {
//     // 用户id
//     userId: number;
//     // 用户名
//     userName: string;
//     // 1.正式账号 0.游客账号
//     userType: UserType
//     // 账号类型
//     accountType: AccountType;
//     // 邮箱
//     email: string;
//     // 邮箱是否验证，0=未设置 1=未验证 2=已验证
//     emailValid: 0 | 1 | 2;
//     // 电话号
//     telephone: string;
//     // 0=登陆  1 = 注册
//     firstLogin: 0 | 1;
//   };
//   // 是否第一次登录
//   firstLogin: boolean;
//   // 平台token
//   token: string;
// }
// interface fbUserInfo {
//   name?: string;
//   email?: string;
//   birthday?: string;
//   gender?: string;
//   id: string;
// }
// interface info {
//   nickName?: string;
//   email?: string;
//   birthday?: string;
//   sex?: 0 | 1;
//   userName: string;
// }
// interface kaKaoUserInfo {
//   nickname?: string;
//   email?: string;
//   birthday?: string;
//   gender?: string;
//   id: string;
// }
