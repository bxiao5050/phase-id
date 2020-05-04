/*  测试服测试使用 */

const config = {
  name: 'test',
  app_key: 'f43968a73df747aab4b9b1e506265050',
  fb_app_id: '663857194035716',
  language: 'TW',
  region: 'sg',
  hoverTop: '.24',
  hoverFromLeft: true,
  mark_id: {
    fb: '',
    markName: {},
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
      formal: 'https://www.narutoh5game.com/h5-plays/index.html'
    },
    facebook: {
      messenger: {
        pc: 'https://www.facebook.com/messages/t/NarutoGame.H5',
        mobile:
          'https://m.facebook.com/messages/read/?tid=445144659622899&entrypoint=web%3Atrigger%3Athread_list_thread&ref=bookmark'
      },
      index: 'https://www.facebook.com/NarutoGame.H5'
    }
  }
};
export default {1:config,default:config}
