const key = '249ad8e87d704756be67e53c5ea8e571';
const fbId = '1304983986332151';
const indexPage = {
  test: 'https://ninja-th.narutoh5game.com/test_hyrz/index.html',
  formal: 'https://ninja-th.narutoh5game.com/h5-plays/index.html'
};
const fansPages = {
  messenger: {
    pc: 'https://www.facebook.com/messages/t/NinjaBattleH5',
    mobile: 'https://www.facebook.com/NinjaBattleH5/'
  },
  index: 'https://www.facebook.com/NinjaBattleH5/'
};

const config = {
  30001: {
    name: 'Ninja Battle',
    app_key: key,
    fb_app_id: '1304983986332151',
    language: 'TH',
    hoverTop: '.24',
    hoverFromLeft: true,
    isPurchasedMark: false,
    download: {
      android: '',
      ios: ''
    },
    page: {
      index: indexPage,
      facebook: fansPages
    }
  },
  1: {
    app_key: key,
    fb_app_id: fbId,
    language: 'TH',
    hoverTop: '.24',
    hoverFromLeft: true,
    // 如果游戏会进行支付打点，此值是false，反之则是true
    isPurchasedMark: false,
    mark_id: {
      markName: {
        sdk_loaded: 'sdkinifinish',
        sdk_purchased_done: 'Purchased',
        sdk_register: 'register',
        sdk_contact_us: 'contact_us'
      },
      adjust: {
        level20: '5e4zjf',
        level100: 'en3uhj',
        level200: 'y6g6iu',
        VIP10: 'ipgqic',
        VIP12: 'gm3ta7',
        VIP14: 'f16k18',
        first_purchase: '5gjzzd',
        create_role: '1z5mji',
        create_role_unique: 'waf1p1',
        login: 'rzotyp',
        login_unique: 'jzvuou',
        register: 'u0ur76',
        register_unique: 'hdj6nh',
        Purchased: '5xlr3s',
        gamelaunch: 'gl9w56',
        contact_us: '950fnh',
        sdkinifinish: 'fv8uuu'
      }
    },
    page: {
      facebook: fansPages
    }
  }
};

export default config;
