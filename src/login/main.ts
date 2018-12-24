
/**
 * GET 参数获取
 * @param name 参数名称
 */
var getUrlParam = (function () {
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
/** 加载jssdk */
var src = './sdk.js?t=' + getUrlParam('t');
(function (d, s, id) {
  var js
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = src
  js.onload = async function () {
    await window.RG['get_game_config']
    const img = document.getElementById('rg-bg-login') as HTMLImageElement
    img.src = window.RG['config'].pic.bg_login
    img.style.display = 'block'
  }
  document.body.appendChild(js)
}(document, 'script', 'rg-jssdk'));

window.rgAsyncInit = function () {
  var urlParamKeyArr = getUrlParam()
  var urlSearch = ''
  var $i = 0
  for (var key of urlParamKeyArr) {
    if (key === 'type') {
      continue
    } else {
      urlSearch += (($i ? '&' : '?') + key + '=' + getUrlParam(key))
      $i++
    }
  }
  var user = encodeURIComponent(JSON.stringify(
    RG.CurUserInfo()
  ))
  urlSearch += '&user=' + user;
  var href = ((getUrlParam('debugger') || window.debugger) ? RG.jssdk.config.page.game.test : RG.jssdk.config.page.game
    .formal) + urlSearch;
  location.href = href
}
