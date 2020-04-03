const appKey = '249ad8e87d704756be67e53c5ea8e571';
const fbAppId = '1304983986332151';
const language = 'TH';
const hoverTop = '.24';
const hoverFromLeft = true;
const isPurchasedMark = false;
const fans = 'https://www.facebook.com/NinjaBattleH5/';
const fbMessengerPc = 'https://www.facebook.com/messages/t/NinjaBattleH5';
const fbMessengerMb = 'https://www.facebook.com/NinjaBattleH5/';
const indexPage = {
  test: 'https://ninja-th.narutoh5game.com/test_hyrz/index.html',
  formal: 'https://ninja-th.narutoh5game.com/h5-plays/index.html'
};

const config: {[key: string]: Config} = {
  30001: {
    name: 'Ninja Battle',
    appKey,
    fbAppId,
    language,
    hoverTop,
    hoverFromLeft,
    isPurchasedMark,
    fans,
    fbMessengerPc,
    fbMessengerMb,
    iosDonloadUrl: '',
    androidDonloadUrl: '',
    indexUrl: indexPage.test
  },
  default: {
    appKey,
    fbAppId,
    language,
    hoverTop,
    hoverFromLeft,
    isPurchasedMark,
    fans,
    fbMessengerPc,
    fbMessengerMb,
    markName: {
      sdk_loaded: 'sdkinifinish',
      sdk_purchased_done: 'Purchased',
      sdk_register: 'register',
      sdk_contact_us: 'contact_us'
    },
    adjustToken: {
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
  }
};
export default config;
