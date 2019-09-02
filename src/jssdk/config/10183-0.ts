export default {
  name: '火影忍者H5',
  app_key: '40af84c65b7d45439e2d3e102ba85bce',
  fb_app_id: '663857194035716',
  language: 'TW',
  region: 'sg',
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
