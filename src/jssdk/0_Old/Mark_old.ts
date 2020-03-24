import Utils from "./Utils_old";
// 打点代码整体拿到了sspa中，有需要可以自行修改
export default class Mark {

  index_url: HTMLAnchorElement
  game_url: HTMLAnchorElement
  isIndex: boolean = false
  _adjust: any
  deviceType = Utils.deviceType;
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
        })(window, document, 'script', `https://www.googletagmanager.com/gtag/js?id=${config.mark_id.ga}`);
        window.dataLayer = window.dataLayer || [];
        this.gtag('js', new Date());
        this.gtag('config', config.mark_id.ga)
      }
      this.Mark = (function (Mark, google) {
        return function (name: string, param: { google: any }) {
          Mark(name, param);
          var paramGoogle;
          if (param && param.google) {
            paramGoogle = param.google
          }
          google(name, paramGoogle);
        };
      })(this.Mark, this.google);
    }

    if (config.mark_id.adjust.id) {
      if (this.isIndex) {
        // 判断设备的平台，只区分ios和android
        var os_name = 'unknown';
        if (this.deviceType.android) {
          os_name = 'android';
        } else if (this.deviceType.ios || this.deviceType.iPhone || this.deviceType.iPad) {
          os_name = 'ios';
        }
        // 检测存在设备id吗，不存在就创建一个
        Utils.CookieManager.getCookie("gps_adid") || Utils.CookieManager.setCookie("gps_adid", Utils.generateGpsAdid(), 365 * 10);
        this._adjust = new Adjust({
          app_token: config.mark_id.adjust.id,
          environment: IS_DEV ? "sandbox" : "production", // or 'sandbox' in case you are testing SDK locally with your web app
          os_name: os_name,
          device_ids: {
            gps_adid: Utils.CookieManager.getCookie("gps_adid") // each web app user needs to have unique identifier
          }
        });
        // session会话，adjust只有在30分钟之后重新打开才算做一次会话，当一个小时内每10分钟重复打开时，这一个小时都会算作一次会话，并且发送的请求会报错返回500
        this._adjust.trackSession(
          function (result) {
            console.info('adjust get session', result);
          },
          function (errorMsg, error) {
            console.info("adjust get session time is short");
          }
        );
        this.Mark = (function (Mark, adjust) {
          var adjustEventToken = config.mark_id.adjust;
          return function (name: string, param: { adjust?: object }) {
            Mark(name, param);
            var paramAdjust = {}
            if (param && param.adjust) {
              paramAdjust = param.adjust
            }
            adjust(name, paramAdjust, adjustEventToken);
          };
        })(this.Mark, this.adjust);
      }
    }
  }

  private gtag: any = function () {
    window.dataLayer.push(arguments);
  }

  asyncData(name, param?) {
    window.$postMessage(JSON.stringify({
      action: 'mark',
      data: {
        name,
        param
      }
    }), window.$rg_main.Mark.index_url.origin)
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

  public adjust = (name: string, param: object, adjustEventToken: object) => {

    if (this.isIndex) {
      if (!adjustEventToken[name]) {
        console.log(`This ${name} associated adjustEventToken not find`);
        return;
      }
      var _eventConfig = Object.assign({ event_token: adjustEventToken[name] }, param);

      this._adjust.trackEvent(
        _eventConfig,
        function (result) {
          console.info(`"${name}" has marked - adjust`);
          console.log("_eventConfig", result);
        },
        function (errorMsg, error) {
          console.log(`"${name}" mark filed - adjust`);
          console.log(errorMsg, error);
        }
      );
    }
  };

  Mark: (name: string, param?: object) => void = (name, param) => {
    !this.isIndex && this.asyncData(name, param)
  }

}
