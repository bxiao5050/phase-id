import { getUrlParam } from './common/utils';
import Base from './base'

export default class Web extends Base {

  config
  fb_sdk_loaded

  constructor(config, fb_sdk_loaded) {
    super()

    this.config = config
    this.fb_sdk_loaded = fb_sdk_loaded

    let RG = function () { }
    RG.prototype.jssdk = this

    window.RG = new RG
    this.ExposeApis()
  }
  Mark(markName: string, markParams: any) {
    // Mark.instance.Mark(markName, markParams);
    const index_origin = IS_DEV || IS_TEST ? window.RG.jssdk.config.page.index.test : window.RG.jssdk.config.page.index.formal;
    window.parent.postMessage(JSON.stringify({
      action: 'mark',
      data: {
        name: markName,
        param: markParams
      }
    }), /(http|https):\/\/(www.)?([A-Za-z0-9-_]+(\.)?)+/.exec(index_origin)[0])
  }

  loadScript(src) {
    let resolve, script = document.createElement('script');
    script.src = src
    script.onload = function () {
      resolve()
    }
    document.head.appendChild(script)
    return new Promise(function (_) {
      resolve = _
    })
  }

  rgAsyncInit() {
    window.rgAsyncInit();
    const index_origin = IS_DEV || IS_TEST ? window.RG.jssdk.config.page.index.test : window.RG.jssdk.config.page.index.formal;
    window.parent.postMessage(JSON.stringify({ action: 'rgAsyncInit' }), /(http|https):\/\/(www.)?([A-Za-z0-9-_]+(\.)?)+/.exec(index_origin)[0]);
  }

  async init() {
    await this.loadScript(reactSrc)
    await Promise.all([reactDomSrc, reactRouterDomSrc].map((src) => {
      return this.loadScript(src)
    }))
    let [{ Ins }] = await Promise.all([import('DOM/index'), RG.jssdk.Account.initPromise])
    window.RG.jssdk.App = Ins
    let user = RG.jssdk.Account.user
    let autoLogin = false
    if (user) {
      autoLogin = true;
    } else {
      if (RG.jssdk.Account.users) {
        let usersIdArr = Object.keys(RG.jssdk.Account.users)
        if (usersIdArr.length) {
          user = RG.jssdk.Account.users[
            usersIdArr[0]
          ]
          autoLogin = true;
        }
      }
    }
    let LoginModule = window.RG.jssdk.App.showLogin()
    if (window.name === 'redirect') {
      window.name = ''
    } else {
      if (autoLogin) {
        await RG.jssdk.Login(user)
        LoginModule.loginComplete()
      }
    }


  }

  ExposeApis() {
    let exposeApis = [
      "server",
      "version",
      "Redirect",
      "Messenger",
      "Fb",
      "CurUserInfo",
      "BindZone",
      "Share",
      "Mark",
      "Pay",
      "Install",
      "ChangeAccount"
    ]
    exposeApis.forEach(api => {
      window.RG[api] = RG.jssdk[api]
    })
  }

  Pay(paymentConfig: PaymentConfig) {
    return RG.jssdk.PaymentConfig(paymentConfig).then(paymentConfigRes => {
      paymentConfigRes.payments.length && window.RG.jssdk.App.showPayment(paymentConfigRes)
    })
  }

  Install() {
    const index_origin = IS_DEV || IS_TEST ? RG.jssdk.config.page.index.test : RG.jssdk.config.page.index.formal;
    if (RG.jssdk.config.type !== 2) {
      let url: string
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        if (RG.jssdk.config.download.ios) {
          url = RG.jssdk.config.download.ios;
        } else {
          url = `${SERVER}/jssdk/${getUrlParam('sdkVersion')}/add-shortcut.html?language=${RG.jssdk.config.language}&system=ios&appId=${RG.jssdk.config.appId}&link=${index_origin}`;
        }

      } else if (/(Android)/i.test(navigator.userAgent)) {
        if (RG.jssdk.config.download.android) {
          url = RG.jssdk.config.download.android;
        } else {
          url = `${SERVER}/jssdk/${getUrlParam('sdkVersion')}/add-shortcut.html?language=${RG.jssdk.config.language}&system=android&appId=${RG.jssdk.config.appId}&link=${index_origin}`;
        }
      } else {
        url = `${SERVER}/platform/shortcut.jsp?link=${encodeURIComponent(index_origin + '?shortcut=true')}&fileName=${RG.jssdk.config.name}&t=${Date.now()}`;
      }
      console.info(url);
      window.open(url)
    }
  }
}
