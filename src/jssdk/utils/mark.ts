import './adjust.min.js';
interface AdjustEventToken {
  [key: string]: string;
}
declare global {
  interface Window {
    ga: Function;
    fbq: Function;
    _fbq: Function;
    dataLayer: any[];
  }
}
let fbPurchasedNum = 0;
export function markInit(markIds: { ga?: string, fb?: string, adjust?: { id: string, eventToken: AdjustEventToken } }) {

  let adjustMark: Function;
  markIds.fb && loadFBPixel(markIds.fb);
  markIds.ga && loadGaPixel(markIds.ga);
  if (markIds.adjust && markIds.adjust.id) {
    adjustMark = (function (_adjust: any, eventToken: AdjustEventToken) { 
      return function (markName: string, params?: any) {
        adjust(_adjust, eventToken, markName, params);
      }
    })(loadAdjust(markIds.adjust.id), markIds.adjust.eventToken);
  }
  return function (markName: string, params?: { google?: any, adjust?: any, currency: string, money: string }) {
    console.info('recive ' + markName)
    // { currency: params.currency, value: params.money }
    markIds.fb && fbMark(markName, params);
    markIds.ga && gaMark(markName, params.google);
    markIds.adjust && markIds.adjust.id && adjustMark(markName, params.adjust);
  }

  function fbMark(markName: string, params?: any) {

    if (params) {
      // 网页的支付点位不能记录重复的打点，因此需要自定义事件点，自增一个参数
      if (markName === 'Purchased' || "sdk_purchased_done") {
        if (fbPurchasedNum === 0) {
          window.fbq('track', 'Purchase', { currency: params.currency, value: params.money });
          fbPurchasedNum++
        } else {
          const name = markName + fbPurchasedNum++;
          window.fbq('trackCustom', name, { currency: params.currency, value: params.money });
        }
      } else if (markName === 'sdk_register') {
        window.fbq('track', 'CompleteRegistration', { currency: 'USD', value: 0 });
      } else {
        window.fbq('trackCustom', markName, params);
      }
      console.info(`"${markName}" has marked - facebook,param${JSON.stringify(params)}`);
    } else {
      window.fbq('trackCustom', markName);
      console.info(`"${markName}" has marked - facebook`);
    }
  }
  function gaMark(markName: string, params?: any) {
    params ? window.ga('event', markName, params) : window.ga('event', markName);
    console.info(`"${markName}" has marked - google`, params);
  }
  function adjust(_adjust: any, adjustEventToken: AdjustEventToken, markName: string, params?: any) {
    if (!adjustEventToken[markName]) {
      console.log(`This ${markName} associated adjustEventToken not find`);
      return;
    }
    const _eventConfig = Object.assign({ event_token: adjustEventToken[markName] }, params);
    _adjust.trackEvent(
      _eventConfig,
      function (result: any) {
        console.info(`"${markName}" has marked - adjust`);
        console.log("_eventConfig", result);
      },
      function (errorMsg: any, error: any) {
        console.log(`"${markName}" mark filed - adjust`);
        console.log(errorMsg, error);
      }
    );
  }
  function loadFBPixel(fbId: string) {
    (function (f, b, e, v, n?: any, t?: any, s?: any) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
      const noscript = document.createElement('noscript');
      noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${fbId}&ev=PageView&noscript=1" />`;
      document.body.appendChild(noscript);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', fbId);
    window.fbq('track', 'PageView');
  }
  function loadGaPixel(gaId: string) {
    (function (f, b, e, v, n?: any, t?: any, s?: any) {
      t = b.createElement(e); t.async = !0;
      t.src = v; t.async = true; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', `https://www.googletagmanager.com/gtag/js?id=${markIds.ga}`);
    window.dataLayer = window.dataLayer || [];
    this.gtag('js', new Date());
    this.gtag('config', markIds.ga);
  }
  function loadAdjust(adjustId: string) {
    const deviceIds = localStorage.getItem('_gps_adid') || setDeviceIds();
    const _adjust = new Adjust({
      app_token: adjustId,
      environment: process.env.NODE_ENV === 'development' ? "sandbox" : "production", // or 'sandbox' in case you are testing SDK locally with your web app
      os_name: getOsName(),
      device_ids: {
        gps_adid: deviceIds // each web app user needs to have unique identifier
      }
    });
    return _adjust
  }
  function getOsName() {
    const u = navigator.userAgent;
    const os_names = {
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
      iPad: u.indexOf('iPad') > -1,
      android: u.indexOf('Android') > -1,
      win: u.indexOf('Windows') > -1
    }
    let result = 'unknown';
    if (os_names.android) {
      result = 'android';
    } else if (os_names.ios || os_names.iPhone || os_names.iPad) {
      result = 'ios';
    }
    return result;
  }
  function setDeviceIds() {
    let result = generateGpsAdid();
    localStorage.setItem('_gps_adid', result)
    return result;
  }
  function generateGpsAdid(len?: number, radix?: number) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [], i: number;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      // rfc4122, version 4 form
      let r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  }

}
