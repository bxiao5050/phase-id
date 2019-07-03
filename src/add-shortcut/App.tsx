import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Swiper from './swiper'
import Languages from './i18n'

export class App extends React.Component {

  constructor(props) {
    super(props)
  }

  getUrlParam = (function () {
    var urlParamMap = {}
    var urlParamKeyArr = []
    var interrogationIndex = location.href.indexOf("?") + 1
    var str = interrogationIndex === 0 ? "" : location.href.slice(interrogationIndex)
    if (str) {
      var arr = str.split(/&|%26/)
      arr.forEach(function (item) {
        var arr = item.split(/=|%3D/)
        var key = arr[0]
        var val = arr[1]
        urlParamMap[key] = val
        urlParamKeyArr.push(key)
      })
    }
    return function (name?) {
      if (name) {
        return urlParamMap.hasOwnProperty(name) ? urlParamMap[name] : null
      } else {
        return urlParamKeyArr
      }
    }
  })()

  state = {
    appId: this.getUrlParam('appId'),
    system: (this.getUrlParam('system') === 'ios' ? 'ios' : "android") as 'ios' | 'android',
    i18n: this.getUrlParam('language') ? Languages[this.getUrlParam('language')] : Languages['EN']
  }

  render() {
    return <div className={'app-container'}>
      <Swiper language={this.getUrlParam('language') ? this.getUrlParam('language') : 'EN'} system={this.state.system} i18n={this.state.i18n} />
    </div>
  }
}

export function init(dom) {
  ReactDOM.render(<App />, dom);
}

