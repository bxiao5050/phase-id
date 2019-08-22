// import { Ins } from 'DOM/BTgame';
import Share from 'Base/Share';
import Api from "Base/Api";
import Http from "Base/Http";
import { signed, formatDate } from "../../utils";

interface BTUrlParams extends UrlParams {
  appid: string;
  uid: string;
  token: string;
  time: string;
  /* md5(appid=appid&time=time&token=token&uid=uid+key) +号不计入加密中*/
  sign: string;
  code: number;
  channel: number;
}

export default class UniteSdk {
  private _user: UserInfo;
  config: JSSDK.Config;
  reactPromise: any;
  reactDomPromise: any;

  constructor(config: any) {
    this.reactPromise = this.loadScript(reactSrc);
    this.reactDomPromise = this.loadScript(reactDomSrc).then(() => {
      import('DOM/BTgame').then((res) => {
        window.RG.jssdk.App = res.Ins;
      })
    });
    this.config = config;
    let rg = function () { }
    rg.prototype.jssdk = this
    window.RG = new rg();
    console.log('this.ExposeApis() before');
    this.ExposeApis();
    this.initGetDeviceMsgAsync();
    this.Login();
  }
  async showNotice(msg: string) {
    await this.reactPromise;
    await this.reactDomPromise;
    window.RG.jssdk.App && window.RG.jssdk.App.showNotice(msg);
  }
  CurUserInfo = (): JSSDK.CurUserInfo => {
    const { userId, userName, token } = this._user;
    return { userId, userName, token };
  }
  // 第三方登录，全部走注册接口。校验参数全部传在exInfo中
  async Login() {

    ['appid', 'uid', 'time', 'token', 'sign'].forEach((item) => {
      if (!this.config.urlParams[item] && this.config.urlParams[item] !== 0) {
        this.showNotice(`${item} is not find.`);
      }
    });
    /* window.rgAsyncInit */
    const { appId, advChannel, sdkVersion, appid, time, token, uid, sign } = this.config.urlParams as BTUrlParams;
    const { source, network, device, deviceNo, model, version, operatorOs } = await window.JsToNative.getDeviceMsgAsync();
    const userName = "BT-" + uid;
    const password = md5(userName);
    const data = {
      appId,
      advChannel,
      userName,
      password,

      nickName: "",
      accountType: 0,
      thirdPartyId: '',
      sex: "",
      birthday: "",
      email: "",
      telephone: "",
      /* 0=默认渠道 1=appota 2=mwork 5=BTgame */
      userChannel: this.config.userChannel,

      source,
      network,
      model,
      operatorOs,
      deviceNo,
      device,
      version,
      sdkVersion,
      exInfo: JSON.stringify({ appid, uid, time, token, sign }),
      /* appId+userName+password+source+appKey */
      sign: signed([appId, userName, password, source, this.config.app_key])
    };
    await Http.instance.post({ route: "/user/v3/register", data }).then((res: LoginRes) => {
      if (res.code === 200) {
        this._user = Object.assign(res.data, {
          password: data.password,
          token: res.token
        });
        window.rgAsyncInit();
      } else if (res.code == 102) {
        this.showNotice(RG.jssdk.config.i18n.code102);
      } else if (res.code == 101) {
        this.showNotice(RG.jssdk.config.i18n.code101);
      } else {
        this.showNotice(res.error_msg);
      }
    }).catch(err => {
      this.showNotice(err);
    })

  }
  /* RG.BindZone */
  BindZone(BindZoneParam: BindZoneParam) {
    return Api.instance.Bind(BindZoneParam)
  }
  /* RG.Share */
  Share(shareUrl: string) {
    return Share.instance.share(shareUrl)
  }
  /* 创建订单 */
  async Pay(paymentConfig: PaymentConfig) {
    const { source, network, device, deviceNo, model, version, operatorOs } = await window.JsToNative.getDeviceMsgAsync();
    const { appId, advChannel, sdkVersion } = this.config.urlParams as BTUrlParams;
    const { code, channel } = this.config;
    const { userId, gameOrderId, gameZoneId, gameCoin, roleId, roleName, level } = paymentConfig;
    const exInfo = JSON.stringify({ gameCoin: gameCoin })
    const data = {
      appId,
      advChannel,
      channel,
      code,
      userId,
      gameOrderId,
      gameZoneId,
      roleId,
      roleName,
      level,
      source,
      deviceNo,
      device,
      network,
      model,
      operatorOs,
      version,
      sdkVersion,
      clientTime: formatDate(),
      itemType: 0,
      exInfo,
      sign: signed([appId, advChannel, userId, roleId, gameOrderId, gameZoneId, source, exInfo, this.config.app_key])
    };
    console.log('createOrder', data)
    Http.instance.post({ route: '/order/create/v4.0', data }).then((orderRes: OrderRes) => {
      if (orderRes.code !== 200) {
        console.error('​Payment -> createOrder -> orderRes', orderRes);
      }
      const { appid, token, uid } = this.config.urlParams as BTUrlParams;
      const amount = orderRes.data.money;
      const extra_orderno = orderRes.data.transactionId;
      const time = Date.now();
      const BTPayData = {
        appid,
        uid,
        token,
        amount,
        serverid: gameZoneId,
        extra_orderno,
        time,
        sign: md5(`amount=${amount}&appid=${appid}&extra_orderno=${extra_orderno}&serverid=${gameZoneId}&time=${time}&token=${token}&uid=${uid + orderRes.data.key}`),
        api: "pay"
      };
      console.log(BTPayData);
      // window.parent.postMessage(JSON.stringify(BTPayData), 'http://h5sdk.btgame99.com');
    })
  }
  initGetDeviceMsgAsync() {
    const WK = window['webkit'];
    if (WK) {
      this.initIosGetDeviceMsgAsync();
    } else {
      window.JsToNative.getDeviceMsgAsync = () => {
        if (!RG.jssdk.deviceMsgPromise) {
          RG.jssdk.deviceMsgPromise = new Promise(resolve => {
            RG.jssdk.deviceMsgResolve = resolve
          })
          setTimeout(function () {
            let data = JSON.parse(window.JsToNative.getDeviceMsg())
            data = Object.assign(data, {
              advChannel: RG.jssdk.config.advChannel,
              appId: RG.jssdk.config.appId
            })

            RG.jssdk.deviceMsgResolve(data)
            RG.jssdk.deviceMsgPromise = null
          })
        }
        return RG.jssdk.deviceMsgPromise
      }
    }

    /* 初始化NativeToJs */
    window.NativeToJs = {
      consumeOrder: () => { },
      jpworkResult: () => { },
      goBack: this.goBack,
      deviceMsg: this.gotDeviceMsg
    }
  }
  initIosGetDeviceMsgAsync() {
    const WK = window['webkit'];
    window.JsToNative = {
      getDeviceMsgAsync: function () {
        if (!RG.jssdk.deviceMsgPromise) {
          RG.jssdk.deviceMsgPromise = new Promise(resolve => {
            RG.jssdk.deviceMsgResolve = resolve
          })
          WK.messageHandlers.getDeviceMsg.postMessage(null)
        }
        return RG.jssdk.deviceMsgPromise
      },
      init: function (param: string) {
        WK.messageHandlers.init.postMessage(param)
      },
      gameEvent: function (param: string) {
        console.log('gameEvent', param)
        WK.messageHandlers.gameEvent.postMessage(param)
      },
      jpwork: function (param: string) {
        WK.messageHandlers.jpwork.postMessage(param)
      },
      consumeOrder: function (param: string) {
        WK.messageHandlers.consumeOrder.postMessage(param)
      },
      exitApp: function () {
        WK.messageHandlers.exitApp.postMessage(null)
      }
    } as any;
  }
  /* 退出 */
  goBack() {
    if (confirm(window.RG.jssdk.config.i18n.tuichu)) {
      JsToNative.exitApp()
    }
  }
  /* 获取设备信息 */
  gotDeviceMsg(deviceMsg: string) {
    let data;
    try {
      data = JSON.parse(deviceMsg)
    } catch (e) {
      console.log(e);
      data = {}
    }

    window.RG.jssdk.deviceMsgResolve(data);
    window.RG.jssdk.deviceMsgPromise = null;
  }
  /* 重新加载页面 */
  Redirect() {
    window.name = 'redirect';
    location.reload();
  }
  /* 给RG上挂载方法 */
  ExposeApis() {
    let exposeApis = [
      "Redirect",
      "CurUserInfo",
      "BindZone",
      "Share",
      "Pay",
    ]
    exposeApis.forEach(api => {
      window.RG[api] = RG.jssdk[api]
    })
  }
  /* 加载js */
  loadScript(src) {
    let resolve, script = document.createElement('script')
    script.src = src
    script.onload = function () {
      resolve()
    }
    document.head.appendChild(script)
    return new Promise(function (_) {
      resolve = _
    })
  }
}
