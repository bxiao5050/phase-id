import Mock from "mockjs";

const Random = Mock.Random

export function getIninSdkRes(options) {
  console.log(JSON.stringify({ url: options.url, type: options.type, body: options.body }));
  const messages = JSON.stringify({
    loginMessageUrl: Random.url(),
    isHasLogin: false,
    isHasPause: false,
    pauseMessageUrl: Random.url(),
  });
  const handlerBtns = JSON.stringify(
    [{
      "btnName": "",
      "btnNormalIcon": "",
      "btnNormalPressIcon": "",
      "btnRedIcon": "",
      "btnRedPressIcon": "",
      "btnUrl": "",
      "showRedSpots": ""
    }]
  );
  const loginMethods = JSON.stringify(
    [{
      loginMethod: "",
      iconUrl: "",
      loginUrl: "",
      callBackUrl: "",
      index: "",
      rotate: 0
    }]
  );
  const verifys = "BX9OPXUIrKUvimS1SrIgSTnV5EYDmwY5i4XkF8TIe6WPA6Neg6wKdl5m05plEQsy";
  const advChannels = JSON.stringify({
    facebookAppId: "",
    appsFlyerDevKey: "",
    talkapp_key: "",
    charboostAppId: "",
    charboostAppSignature: "",
    ewayAppId: "",
    mobvistaSDKAppId: "",
    admobConversionID: "",
    admobValue: ""
  })
  const publics = JSON.stringify({
    common: {
      name: "火影忍者H5",
      fbAppId: "663857194035716",
      kakao: "",
      language: "zh-CN",
      isPurchasedMark: false
    },
    dom: {
      isShow: true,
      hoverTop: '.24',
      hoverFromLeft: true,
    },
    mark: {
      fbId: '663857194035716',
      gaId: '',
      adjustId: '',
      eventToken: {
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
      }
    },
    pages: {
      rgIndex: 'http:127.0.0.1/index.html',
      fans: 'https://www.facebook.com/NarutoGame.H5',
      messenger: "https://www.facebook.com/messages/t/NarutoGame.H5"
    }
  });
  return {
    code: 200, error_msg: 'success', "imageRootUrl": "http://sss",
    messages, handlerBtns, loginMethods, verifys, advChannels, publics
  }
}
