import Utils from "Base/Utils";

export default class Mark {

  game_host: string
  private config: JSSDK.Config

  static _ins: Mark
  static get instance(): Mark {
    return this._ins || new Mark;
  }
  constructor(config?: JSSDK.Config) {
    Mark._ins = this
    this.init(config)
  }

  private init(config: JSSDK.Config) {
    if (config.mark_id.fb) {
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
          n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
        n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);

        const noscript = document.createElement('noscript')
        noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${config.mark_id.fb}&ev=PageView&noscript=1" />`;
        document.head.appendChild(noscript);
      })(window, document, 'script',
        'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', config.mark_id.fb);
      window.fbq('track', 'PageView');

      this.Mark = (function (Mark, facebook) {
        return function (name: string, param: object) {
          Mark(name, param)
          facebook(name)
        }
      })(this.Mark, this.facebook)
    }
    if (config.mark_id.ga) {
      (function (f, b, e, v, n, t, s) {
        t = b.createElement(e); t.async = !0;
        t.src = v; t.async = true; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script',
        `https://www.googletagmanager.com/gtag/js?id=${config.mark_id.ga}`);
      window.dataLayer = window.dataLayer || [];
      this.gtag('js', new Date());
      // this.gtag('config', config.mark_id.ga);
      let reg_exp = new RegExp(/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+/)
      let login_page = SERVER
      let game_page = Utils.getUrlParam('debugger') || window['debugger'] ? config.page.game.test : config.page.game.formal
      this.game_host = game_page.match(reg_exp)[0]
      let login_host = login_page.match(reg_exp)[0]
      this.gtag('config', config.mark_id.ga, {
        'linker': {
          'domains': [login_host, this.game_host],
          'accept_incoming': true
        }
      })

      this.Mark = (function (Mark, google) {
        return function (name: string, param: object) {
          Mark(name, param)
          google(name, param)
        }
      })(this.Mark, this.google)
    }
  }

  private gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  }

  private facebook(name: string) {
    window.fbq('track', name)
    console.info(`"${name}" has marked - facebook`)
  }

  private google = (name: string, param: any) => {
    param ? this.gtag('event', name, param) : this.gtag('event', name)
    console.info(`"${name}" has marked - google`, param)
  }

  Mark: (name: string, param?: object) => void = function () { }

}