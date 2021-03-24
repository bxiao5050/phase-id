import th from '../languages/th';

const configs: {
  default: Config;
  [key: number]: Partial<Config>;
} = {
  30001: {
    name: 'Ninja Battle',
    iosDonloadUrl: '',
    androidDonloadUrl: '',
    // 'https://ninja-th.narutoh5game.com/test_hyrz/index.html',
    indexUrl: 'https://ninja-th.narutoh5game.com/h5-plays/index.html'
  },
  default: {
    appKey: '249ad8e87d704756be67e53c5ea8e571',
    fbAppId: '1304983986332151',
    language: 'th',
    i18n: th,
    hoverTop: '.24',
    hoverFromLeft: true,
    isPurchasedMark: false,
    fans: 'https://www.facebook.com/NinjaBattleH5/',
    fbMessengerPc: 'https://www.facebook.com/messages/t/NinjaBattleH5',
    fbMessengerMb: 'https://www.facebook.com/NinjaBattleH5/',
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
export default configs;
