// 火影游戏
export default {
  name: '火影忍者H5',
  app_key: '40af84c65b7d45439e2d3e102ba85bce',
  fb_app_id: '663857194035716',
  language: 'TW',
  region: 'sg',
  hoverTop: '.24',
  hoverFromLeft: true,
  mark_id: {
    fb: '663857194035716',
    markName: {},
    adjust: {},
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
