import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Swiper from './swiper'

const i18n = {
  en: `Download to desktop:\nStep1: Login game first，open the menu of the browser.\nStep2: Select "Add to Home Screen" button.\nStep3: Enter "Poke" and click Add to complete downloading to desktop.\nStep4: Login game by click icon from your phone desktop and receive the  reward.`
}

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
    images: this.getUrlParam('system') === 'ios' ? ['ios/1.png', 'ios/2.png', 'ios/3.png', 'ios/4.png'] : ['android/1.png', 'android/2.png', 'android/3.png', 'android/4.png']
  }

  render() {
    return <div>
      <div className="state">
        {(() => {
          return i18n[this.getUrlParam('lang') || 'en'].split('\n').map(txt => {
            return <p>{txt}</p>
          })
        })()}
      </div>
      <Swiper images={this.state.images} />
    </div>
  }
}

export function init(dom) {
  ReactDOM.render(<App />, dom);
}

