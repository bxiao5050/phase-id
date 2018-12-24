
export default class Polyfill {
  static _ins: Polyfill
  static get instance(): Polyfill {
    return this._ins || new Polyfill;
  }
  constructor() {
    Polyfill._ins = this
  }

  polyfills = ['Promise', 'Set', 'Map', 'Object.assign']
  polyfillUrl = 'https://polyfill.io/v2/polyfill.min.js'
  features = [];
  init() {
    this.polyfills.forEach(feature => {
      if (!(feature in window)) {
        this.features.push(feature)
      }
    })
    if (this.features.length) {
      var s = document.createElement('script');
      s.src = `${this.polyfillUrl}?features=${this.features.join(',')}&flags=gated,always&rum=0&callback=RgPolyfilled`;
      s.async = true;
      document.head.appendChild(s);
    } else {
      window.RgPolyfilled()
    }
  }

}