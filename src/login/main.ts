
/**
 * GET 参数获取
 * @param name 参数名称
 */
const getUrlParam = (function () {
  let urlParamMap = {}
  let urlParamKeyArr = []
  let interrogationIndex = location.href.indexOf("?") + 1
  let str = interrogationIndex === 0 ? "" : location.href.slice(interrogationIndex)
  if (str) {
    let arr = str.split(/&|%26/)
    arr.forEach(function (item) {
      let arr = item.split(/=|%3D/)
      let key = arr[0]
      let val = arr[1]
      urlParamMap[key] = val
      urlParamKeyArr.push(key)
    })
  }
  return function (name?: string) {
    if (name) {
      return urlParamMap.hasOwnProperty(name) ? urlParamMap[name] : null
    } else {
      return urlParamKeyArr
    }
  }
})()

const t = getUrlParam('t')
const isDebugger = getUrlParam('debugger') || window.debugger
/** 加载jssdk */
const src = `./sdk.js?t=${t}`;
(function (d, s, id) {
  let js
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = src
  js.onload = async function () {
    const main = window['rgMain'] || window['RG']
    await main['get_game_config']
    const img = document.getElementById('rg-bg-login') as HTMLImageElement
    img.src = main['config'].pic.bg_login
    img.style.display = 'block'
  }
  document.body.appendChild(js)
}(document, 'script', 'rg-jssdk'));

window.rgAsyncInit = function () {
  let urlParamKeyArr = getUrlParam()
  let urlSearch = ''
  let $i = 0
  for (let key of urlParamKeyArr) {
    if (key === 'type') {
      continue
    } else {
      urlSearch += (($i ? '&' : '?') + key + '=' + getUrlParam(key))
      $i++
    }
  }
  let user = encodeURIComponent(JSON.stringify(
    RG.CurUserInfo()
  ))
  urlSearch += '&user=' + user;
  let href = (isDebugger ? RG.jssdk.config.page.game.test : RG.jssdk.config.page.game
    .formal) + urlSearch;
  location.href = href
}
