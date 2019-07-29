/*
var config1 = { // 独步江湖
  fb_app_id: '576748762692133',
  app_key: 'b586ea8260744d3bb045b488ed6658af',
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
  app_key: '6a5e960397cc47918ce7655cb14ddc57',
  fb_app_id: '230571104400727',//
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
  app_key: '6a5e960397cc47918ce7655cb14ddc57',
  fb_app_id: '207109776827136',
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
  app_key: '6a5e960397cc47918ce7655cb14ddc57',
  fb_app_id: '406727743486761',//
  messenger: 'https://business.facebook.com/ipocketgames.xlj/?business_id=272212516313332&ref=bookmarks',
  fanpage: 'https://business.facebook.com/ipocketgames.xlj/?business_id=272212516313332&ref=bookmarks',
  FbPageId: '350841588735718',
  server: 'https://sdk-sg.pocketgamesol.com/pocketgames/client',
  test: 'https://sdk-test.changic.net.cn/pocketgames/client',
  markFBID: '248456995960454',
  markGAID: 'UA-121906563-4',
  language: 'TW'
}

const kdxs_default = {
  name: 'PokemonQuest',
  app_key: 'bebb9e42c3984939ae9dd3410d13666f',
  fb_app_id: '738722513164399',
  language: 'TW',
  region: 'SG',
  hoverTop: '.24',
  hoverFromLeft: true,
  adjust: {
    "15checkin": 'w5sxdd',
    "1checkin": 'ghk4yg',
    "3checkin": 'm2av3x',
    "7checkin": 'jpt49t',
    after1fightpurchase: '5n7ict',
    createrole: 'kaiic7',
    purchase: 'irurum',
    reachstage10: 'pgfaus',
    reachstage2: 'nabqrb',
    sdk_contact_us: 'fj41q7',
    sdk_loaded: 'mpy6ez',
    sdk_purchased_done: 's9mjpp',
    sdk_register: '51060t',
    startgame: '5yrpx0',
    vip13: 'czsty7',
    vip3: '6apvi1',
    vip9: 'eyb7xs',
  },
  mark_id: {
    // ga: 'UA-102180151-44',
    // fb: '2245057485737002',
    adjust: {
      id: 'pjrt3uo6at4w',
      adjustEventToken: {
        sdk_loaded: 'iknv5s',
        sdk_purchased_done: 'epzwq6',
        sdk_register: 't3vg8g',
        sdk_contact_us: 'crtd1q',
        startgame: 'tzx0ib',
        reachstage2: 'elccby',
        after1fightpurchase: 'rof9dr',
        vip9: 'r36s34',
        vip3: '1w2pm8',
        vip13: 'gttht6',
        '1checkin': 'r673tm',
        '7checkin': 'xwaj66',
        '15checkin': 'no3fvr',
        share_screen: '5hnsys',
        reachstage10: '7ffprl',
        purchase: 'gsxt0v',
        createrole: 'y45q47'
      }
    }
  },
  server: {
    test: 'https://sdk-test.changic.net.cn/pocketgames/client',
    formal: 'https://desdk-cdn.pkmonquest.com/pocketgames/client',
  },
  download: {
    android: 'https://pixel.pkmonquest.com/Pokemon-Quest.apk?v1'
  },
  page: {
    index: {
      test: 'https://pixel.pkmonquest.com/h5-plays/index.html',
      formal: 'https://pixel.pkmonquest.com/h5-plays/index.html',
    },
    game: {
      test: 'https://xytest.xulonggame.com/royalgame.html',
      formal: 'https://xy.xulonggame.com/xy.html',
    },
    facebook: {
      messenger: {
        pc: 'https://www.facebook.com/messages/t/PokemonQuestH5',
        mobile: 'https://m.facebook.com/messages/read/?tid=cid.c.100022096656162%3A330991297630321&entrypoint=web%3Atrigger%3Athread_list_thread'
      },
      index: 'https://www.facebook.com/PokemonQuestH5'
    }
  }
}
*/
// 测试支付页面
const test = {
  name: 'test',
  app_key: 'f43968a73df747aab4b9b1e506265050',
  fb_app_id: '',
  language: 'TW',
  region: 'SG',
  hoverTop: '.24',
  hoverFromLeft: true,
  mark_id: {
    fb: '',
    markName: {
    },
    adjust: {}
  },
  server: {
    test: 'https://sdk-test.changic.net.cn/pocketgames/client',
    formal: 'https://sdk-sg.pocketgamesol.com/pocketgames/client'
  },
  download: {
    android: 'https://play.google.com/store/apps/details?id=com.fengkuangzhi.renzhe',
    ios: 'https://apps.apple.com/tw/app/id1466051116'
  },
  page: {
    index: {
      test: 'https://www.narutoh5game.com/test_hyrz/index.html',
      formal: 'https://www.narutoh5game.com/h5-plays/index.html',
    },
    facebook: {
      messenger: {
        pc: 'https://www.facebook.com/messages/t/NarutoGame.H5',
        mobile: 'https://m.facebook.com/messages/read/?tid=445144659622899&entrypoint=web%3Atrigger%3Athread_list_thread&ref=bookmark',
      },
      index: 'https://www.facebook.com/NarutoGame.H5'
    }
  }
}

// 火影游戏
const hy_default = {
  name: '火影忍者H5',
  app_key: '40af84c65b7d45439e2d3e102ba85bce',
  fb_app_id: '663857194035716',
  language: 'TW',
  region: 'SG',
  hoverTop: '.24',
  hoverFromLeft: true,
  mark_id: {
    fb: '663857194035716'
  },
  server: {
    test: 'https://sdk-test.changic.net.cn/pocketgames/client',
    formal: 'https://sdk-sg.pocketgamesol.com/pocketgames/client'
  },
  download: {
    android: 'https://play.google.com/store/apps/details?id=com.fengkuangzhi.renzhe',
    ios: 'https://apps.apple.com/tw/app/id1466051116'
  },
  page: {
    index: {
      test: 'https://www.narutoh5game.com/test_hyrz/index.html',
      formal: 'https://www.narutoh5game.com/h5-plays/index.html',
    },
    facebook: {
      messenger: {
        pc: 'https://www.facebook.com/messages/t/NarutoGame.H5',
        mobile: 'https://m.facebook.com/messages/read/?tid=445144659622899&entrypoint=web%3Atrigger%3Athread_list_thread&ref=bookmark',
      },
      index: 'https://www.facebook.com/NarutoGame.H5'
    }
  }
}



const hy_ios_0 = {
  name: '火影忍者H5',
  app_key: '40af84c65b7d45439e2d3e102ba85bce',
  fb_app_id: '663857194035716',
  language: 'TW',
  region: 'SG',
  hoverTop: '.24',
  hoverFromLeft: true,
  // 如果游戏会进行支付打点，此值是false，反之则是true
  isPurchasedMark: false,
  mark_id: {
    fb: '663857194035716',
    markName: {
      "sdk_loaded": "sdkinifinish",
      "sdk_register": "register",
      "sdk_purchased_done": "Purchased",
      "sdk_contact_us": "contact_us"
    },
    adjust: {
      "level20": 'uc5jjw',
      "level100": 'bpi2ty',
      "level200": 'phoelc',
      "VIP10": 'ze1ckm',
      "VIP12": '97n4a6',
      "VIP14": 'uc0jn4',
      "first_purchase": 'o7ogi5',
      "create_role": 'da23d9',
      "create_role_unique": "t7sth0",
      "login": 'czl1se',
      "login_unique": "ayxneh",
      "register_unique": "7dgfe1",
      "register": 'tgh0a5',
      "Purchased": 'ua8cxm',
      "gamelaunch": 'owaaxh',
      "contact_us": '5pat1a',
      "sdkinifinish": 'i1pi4r'
    },
  },
  server: {
    test: 'https://sdk-test.changic.net.cn/pocketgames/client',
    formal: 'https://sdk-sg.pocketgamesol.com/pocketgames/client'
  },
  page: {
    index: {
      test: 'https://www.narutoh5game.com/test_hyrz/index.html',
      formal: 'https://www.narutoh5game.com/h5-plays/index.html',
    },
    facebook: {
      messenger: {
        pc: 'https://www.facebook.com/messages/t/NarutoGame.H5',
        mobile: 'https://m.facebook.com/messages/read/?tid=445144659622899&entrypoint=web%3Atrigger%3Athread_list_thread&ref=bookmark',
      },
      index: 'https://www.facebook.com/NarutoGame.H5'
    }
  }
}
const hy_google_1 = {
  name: '火影忍者H5',
  app_key: '40af84c65b7d45439e2d3e102ba85bce',
  fb_app_id: '663857194035716',
  language: 'TW',
  region: 'SG',
  hoverTop: '.24',
  hoverFromLeft: true,
  // 如果游戏会进行支付打点，此值是false，反之则是true
  isPurchasedMark: false,
  mark_id: {
    fb: '663857194035716',
    markName: {
      "sdk_loaded": "sdkinifinish",
      "sdk_purchased_done": "Purchased",
      "sdk_register": "register",
      "sdk_contact_us": "contact_us"
    },
    adjust: {
      "level20": 'uc5jjw',
      "level100": 'bpi2ty',
      "level200": 'phoelc',
      "VIP10": 'ze1ckm',
      "VIP12": '97n4a6',
      "VIP14": 'uc0jn4',
      "first_purchase": 'o7ogi5',
      "create_role": 'da23d9',
      "create_role_unique": "t7sth0",
      "login": 'czl1se',
      "login_unique": "ayxneh",
      "register_unique": "7dgfe1",
      "register": 'tgh0a5',
      "Purchased": 'ua8cxm',
      "gamelaunch": 'owaaxh',
      "contact_us": '5pat1a',
      "sdkinifinish": 'i1pi4r'
    },
  },
  server: {
    test: 'https://sdk-test.changic.net.cn/pocketgames/client',
    formal: 'https://sdk-sg.pocketgamesol.com/pocketgames/client'
  },
  page: {
    index: {
      test: 'https://www.narutoh5game.com/test_hyrz/index.html',
      formal: 'https://www.narutoh5game.com/h5-plays/index.html',
    },
    facebook: {
      messenger: {
        pc: 'https://www.facebook.com/messages/t/NarutoGame.H5',
        mobile: 'https://m.facebook.com/messages/read/?tid=445144659622899&entrypoint=web%3Atrigger%3Athread_list_thread&ref=bookmark',
      },
      index: 'https://www.facebook.com/NarutoGame.H5'
    }
  }
}


const config = {
  /*   10120: {
      default: config2,
      18: config3,
      32001: config4
    }, */
  // 修改
  10062: {
    1: test,
    default: test
  },
  10183: {
    1: hy_google_1,
    0: hy_ios_0,
    default: hy_default
  }
}

export default config
