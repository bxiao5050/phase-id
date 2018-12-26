import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Swiper from './swiper'

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
    images: this.getUrlParam('system') === 'ios' ? ['ios/1.jpg', 'ios/2.jpg', 'ios/3.jpg', 'ios/4.jpg'] : ['android/1.jpg', 'android/2.jpg', 'android/3.jpg', 'android/4.jpg']
  }

  render() {
    return <div className="app-container">
      <Swiper images={this.state.images} />
    </div>
  }
}

export function init(dom) {
  ReactDOM.render(<App />, dom);
}

