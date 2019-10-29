export default {
  app_key: '249ad8e87d704756be67e53c5ea8e571',
  fb_app_id: '1304983986332151',
  language: 'TH',
  region: 'sg',
  hoverTop: '.24',
  hoverFromLeft: true,
  // 如果游戏会进行支付打点，此值是false，反之则是true
  isPurchasedMark: false,
  mark_id: {
    fb: '1304983986332151',
    markName: {
      "sdk_loaded": "sdkinifinish",
      "sdk_purchased_done": "Purchased",
      "sdk_register": "register",
      "sdk_contact_us": "contact_us"
    },
    adjust: {
      "level20": '',
      "level100": '',
      "level200": '',
      "VIP10": '',
      "VIP12": '',
      "VIP14": '',
      "first_purchase": '',
      "create_role": '',
      "create_role_unique": "",
      "login": '',
      "login_unique": "",
      "register_unique": "",
      "register": '',
      "Purchased": '',
      "gamelaunch": '',
      "contact_us": '',
      "sdkinifinish": ''
    },
  },
  // server: {
  //   test: 'https://sdk-test.changic.net.cn/pocketgames/client',
  //   formal: 'https://sdk-sg.pocketgamesol.com/pocketgames/client'
  // },
  page: {
    facebook: {
      messenger: {
        pc: 'https://www.facebook.com/messages/t/NarutoGame.H5',
        mobile: 'https://m.facebook.com/messages/read/?tid=445144659622899&entrypoint=web%3Atrigger%3Athread_list_thread&ref=bookmark',
      },
      index: 'https://www.facebook.com/NarutoGame.H5'
    }
  }
}
