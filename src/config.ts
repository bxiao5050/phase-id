var config1 = { // 独步江湖
  FbAppID: '576748762692133',
  appKey: 'b586ea8260744d3bb045b488ed6658af',
  messenger: 'https://m.me/DocBoGiangHo',
  fanpage: 'https://www.facebook.com/DocBoGiangHo/',
  FbPageId: '350841588735718',
  server: '//sdk-android-vndbjh.bilivfun.com/pocketgames/client',
  test: 'http://sdk-test.changic.net.cn:8191/pocketgames/client',
  markFBID: '1490773921035020',
  markGAID: 'UA-117997360-5',
  language: 'VN'
}
var config2 = { // 仙灵记
  appKey: '6a5e960397cc47918ce7655cb14ddc57',
  FbAppID: '230571104400727',// 
  messenger: 'https://business.facebook.com/ipocketgames.xlj/?business_id=272212516313332&ref=bookmarks',
  fanpage: 'https://business.facebook.com/ipocketgames.xlj/?business_id=272212516313332&ref=bookmarks',
  FbPageId: '350841588735718',
  server: 'https://sdk-sg.pocketgamesol.com/pocketgames/client',
  test: 'https://sdk-test.changic.net.cn/pocketgames/client',
  markFBID: '248456995960454',
  markGAID: 'UA-121906563-4',
  language: 'TW'
}
var config3 = { // 仙灵记
  appKey: '6a5e960397cc47918ce7655cb14ddc57',
  FbAppID: '207109776827136',
  messenger: 'https://business.facebook.com/ipocketgames.xlj/?business_id=272212516313332&ref=bookmarks',
  fanpage: 'https://business.facebook.com/ipocketgames.xlj/?business_id=272212516313332&ref=bookmarks',
  FbPageId: '350841588735718',
  server: 'https://sdk-sg.pocketgamesol.com/pocketgames/client',
  test: 'https://sdk-test.changic.net.cn/pocketgames/client',
  markFBID: '',
  markGAID: '',
  language: 'TW'
}
var config4 = { // 仙灵记
  appKey: '6a5e960397cc47918ce7655cb14ddc57',
  FbAppID: '406727743486761',// 
  messenger: 'https://business.facebook.com/ipocketgames.xlj/?business_id=272212516313332&ref=bookmarks',
  fanpage: 'https://business.facebook.com/ipocketgames.xlj/?business_id=272212516313332&ref=bookmarks',
  FbPageId: '350841588735718',
  server: 'https://sdk-sg.pocketgamesol.com/pocketgames/client',
  test: 'https://sdk-test.changic.net.cn/pocketgames/client',
  markFBID: '248456995960454',
  markGAID: 'UA-121906563-4',
  language: 'TW'
}
var config5 = { // 像素口袋1
  appKey: 'bebb9e42c3984939ae9dd3410d13666f',
  FbAppID: '738722513164399',
  messenger: 'https://business.facebook.com/ipocketgames.xlj/?business_id=272212516313332&ref=bookmarks',
  fanpage: 'https://business.facebook.com/ipocketgames.xlj/?business_id=272212516313332&ref=bookmarks',
  FbPageId: '350841588735718',
  server: {
    test: 'https://sdk-test.changic.net.cn/pocketgames/client',
    formal: 'https://desdk-cdn.pkmonquest.com/pocketgames/client',
  },
  markFBID: '2245057485737002',
  markGAID: 'UA-102180151-44',
  language: 'TW',
  gamePage: {
    test: 'http://xytest.xulonggame.com/royalgame.html',
    formal: 'http://www.baidu.com',
  },
  loginPage: {
    test: 'http://www.baidu.com',
    formal: 'http://www.baidu.com',
  },
}

export default {
  10116: {
    default: config1,
  },
  10120: {
    default: config2,
    18: config3,
    32001: config4,
  },
  10133: {
    default: config5
  }
}