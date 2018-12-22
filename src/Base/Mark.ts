import Utils from "./Utils";

export default class Mark {

  gameHost

  static _ins: Mark
  static get instance(): Mark {
    return this._ins || new Mark;
  }
  constructor() {
    Mark._ins = this
  }

  init() {
    if (RG.jssdk.config.mark_id.fb) {
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
          n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
        n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);

        var noscript = document.createElement('noscript')
        noscript.innerHTML = `<img height="1" width="1" style="display:none" src = "https://www.facebook.com/tr?id=${RG.jssdk.config.mark_id.fb}&ev=PageView&noscript=1" />`;
        document.body.appendChild(noscript);
      })(window, document, 'script',
        'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', RG.jssdk.config.mark_id.fb);
      window.fbq('track', 'PageView');
    }

    if (RG.jssdk.config.mark_id.ga) {
      (function (f, b, e, v, n, t, s) {
        t = b.createElement(e); t.async = !0;
        t.src = v; t.async = true; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script',
        `https://www.googletagmanager.com/gtag/js?id=${RG.jssdk.config.mark_id.ga}`);
      window.dataLayer = window.dataLayer || [];
      this.gtag('js', new Date());
      // this.gtag('config', RG.jssdk.config.mark_id.ga);
      let reg = new RegExp(/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+/)
      let loginPage = RG.jssdk.config.page.login
      let gamePage = Utils.getUrlParam('debugger') || window['debugger'] ? RG.jssdk.config.page.game.test : RG.jssdk.config.page.game.formal
      this.gameHost = gamePage.match(reg)[0]
      let loginHost = loginPage.match(reg)[0]
      console.log('console.log location host', location.host)
      console.log('console.log gtag host', [loginHost, this.gameHost])
      this.gtag('config', RG.jssdk.config.mark_id.ga, {
        'linker': {
          'domains': [loginHost, this.gameHost],
          'accept_incoming': true
        }
      })
    }
  }

  gtag(...args) {
    window.dataLayer.push(arguments);
  }

  Mark(markName: string, param: any = '') {

    if (RG.jssdk.config.mark_id.fb) {
      window.fbq('track', markName)
      console.info(`"${markName}" has marked - facebook`)
    }

    if (RG.jssdk.config.mark_id.ga) {
      if (param) {
        this.gtag('event', markName, param)
      } else {
        this.gtag('event', markName)
      }
      console.info(`"${markName}" has marked - google`, param)
    }
  }
}