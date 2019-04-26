
export default class Polyfill {
  static _ins: Polyfill
  static get instance(): Polyfill {
    return this._ins || new Polyfill;
  }
  constructor() {
    Polyfill._ins = this
  }

  polyfills = ['Promise', 'Set', 'Map', 'Object.assign']
  polyfillUrl = 'https://polyfill.io/v3/polyfill.min.js'
  features = [];
  init() {
    this.polyfills.forEach(feature => {
      if (!(feature in window)) {
        this.features.push(feature)
      }
    })
    if (this.features.length) {
      var s = document.createElement('script');
      s.src = `${this.polyfillUrl}?features=${this.features.join(',')}&flags=gated,always&rum=0`;
      s.async = true;
      document.head.appendChild(s);
      s.onload = function () {
        window.RgPolyfilled()
      }
    } else {
      window.RgPolyfilled()
    }
  }

}