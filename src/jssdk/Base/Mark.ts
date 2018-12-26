import Utils from "Base/Utils";

export default class Mark {

  index_host: string
  login_host: string
  game_host: string

  static _ins: Mark
  static get instance(): Mark {
    return this._ins || new Mark;
  }
  constructor(config?: JSSDK.Config) {
    Mark._ins = this

    let reg_exp = new RegExp(/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+/)
    let index_page = config.page.index
    let login_page = SERVER
    let game_page = Utils.getUrlParam('debugger') || window['debugger'] ? config.page.game.test : config.page.game.formal

    this.index_host = index_page.match(reg_exp)[0]
    this.login_host = login_page.match(reg_exp)[0]
    this.game_host = game_page.match(reg_exp)[0]

    this.init(config)
  }

  private init(config: JSSDK.Config) {
    let this_ = this
    if (config.mark_id.fb) {
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
          n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
        n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        t.onload = function () {
          this_.asyncFbR()
        }
        s.parentNode.insertBefore(t, s);
        const noscript = document.createElement('noscript')
        noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${config.mark_id.fb}&ev=PageView&noscript=1" />`;
        document.body.appendChild(noscript);
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
        t.onload = function () {
          this_.asyncGaR()
        }
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script',
        `https://www.googletagmanager.com/gtag/js?id=${config.mark_id.ga}`);
      window.dataLayer = window.dataLayer || [];
      // let hosts = [this.index_host, this.login_host, this.game_host]
      this.gtag('js', new Date());
      this.gtag('config', config.mark_id.ga)
      // location.host === this.index_host
      //   ? this.gtag('config', config.mark_id.ga, {
      //     // linker: {
      //     //   domains: hosts,
      //     //   accept_incoming: true,
      //     // },
      //     cookie_expires: 0,
      //     cookie_domain: 'none'
      //   }) : this.gtag('config', config.mark_id.ga, {
      //     cookie_expires: 0,
      //     cookie_domain: 'none'
      //   })
      this.Mark = (function (Mark, google) {
        return function (name: string, param: object) {
          Mark(name, param)
          google(name, param)
        }
      })(this.Mark, this.google)

    }

  }

  private gtag: any = function () {
    window.dataLayer.push(arguments);
  }
  asyncFbR
  asyncFb = new Promise((resolve) => {
    this.asyncFbR = resolve
  })

  private facebook = async (name: string) => {
    console.info('facebook')
    await this.asyncFb
    window.fbq('track', name)
    console.info(`"${name}" has marked - facebook`)
  }

  asyncGaR
  asyncGa = new Promise((resolve) => {
    this.asyncGaR = resolve
  })

  private google = async (name: string, param: any) => {
    console.info('google', name, param)
    await this.asyncGa
    param ? this.gtag('event', name, param) : this.gtag('event', name)
    console.info(`"${name}" has marked - google`, param)
  }

  Mark: (name: string, param?: object) => void = function () { }

}