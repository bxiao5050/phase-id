
export default class Mark {
  static _ins: Mark
  static get instance(): Mark {
    return this._ins || new Mark;
  }
  constructor() {
    Mark._ins = this
  }

  init() {
    if (SDK.config.markFBID) {
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
        noscript.innerHTML = `<img height="1" width="1" style="display:none" src = "https://www.facebook.com/tr?id=${SDK.config.markFBID}&ev=PageView&noscript=1" />`;
        document.body.appendChild(noscript);
      })(window, document, 'script',
        'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', SDK.config.markFBID);
      window.fbq('track', 'PageView');
    }

    if (SDK.config.markGAID) {
      (function (f, b, e, v, n, t, s) {
        t = b.createElement(e); t.async = !0;
        t.src = v; t.async = true; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script',
        `https://www.googletagmanager.com/gtag/js?id=${SDK.config.markGAID}`);
      window.dataLayer = window.dataLayer || [];
      this.gtag('js', new Date());
      this.gtag('config', SDK.config.markGAID);
    }
  }

  gtag(...args) {
    window.dataLayer.push(arguments);
  }

  Mark(markName: string) {
    if (SDK.config.markFBID) {
      window.fbq('track', markName)
    }
    if (SDK.config.markGAID) {
      this.gtag('event', markName)
    }
    if (SDK.config.markFBID || SDK.config.markGAID) console.info(`"${markName}" has marked - web`)
  }
}