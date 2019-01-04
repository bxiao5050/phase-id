import Utils from "Base/Utils";

export default class Mark {

  index_url: HTMLAnchorElement
  game_url: HTMLAnchorElement
  isIndex: boolean = false

  static _ins: Mark
  static get instance(): Mark {
    return this._ins || new Mark;
  }
  constructor(config?: JSSDK.Config) {
    Mark._ins = this


    this.index_url = document.createElement('a')
    this.game_url = document.createElement('a')

    if (Utils.getUrlParam('debugger') || window['debugger']) {
      this.index_url.href = config.page.index.test
      this.game_url.href = config.page.game.test
    } else {
      this.index_url.href = config.page.index.formal
      this.game_url.href = config.page.game.formal
    }

    if (location.host === this.index_url.host && location.pathname === this.index_url.pathname) this.isIndex = true
    this.init(config)
  }

  private init(config: JSSDK.Config) {
    if (config.mark_id.fb) {
      if (this.isIndex) {
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
          document.body.appendChild(noscript);
        })(window, document, 'script',
          'https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', config.mark_id.fb);
        window.fbq('track', 'PageView');
      }
      this.Mark = (function (Mark, facebook) {
        return function (name: string, param: object) {
          Mark(name, param)
          facebook(name)
        }
      })(this.Mark, this.facebook)
    }
    if (config.mark_id.ga) {
      if (this.isIndex) {
        (function (f, b, e, v, n, t, s) {
          t = b.createElement(e); t.async = !0;
          t.src = v; t.async = true; s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s);
        })(window, document, 'script',
          `https://www.googletagmanager.com/gtag/js?id=${config.mark_id.ga}`);
        window.dataLayer = window.dataLayer || [];
        this.gtag('js', new Date());
        this.gtag('config', config.mark_id.ga)
      }
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

  asyncData(name, param?) {
    window.parent.postMessage({
      action: 'mark',
      data: {
        name,
        param
      }
    }, window.$rg_main.Mark.index_url.origin)
  }

  private facebook = (name: string) => {
    if (this.isIndex) {
      window.fbq('track', name)
      console.info(`"${name}" has marked - facebook`)
    }
  }

  private google = (name: string, param: any) => {
    if (this.isIndex) {
      param ? this.gtag('event', name, param) : this.gtag('event', name)
      console.info(`"${name}" has marked - google`, param)
    }
  }

  Mark: (name: string, param?: object) => void = (name, param) => {
    !this.isIndex && this.asyncData(name, param)
  }

}