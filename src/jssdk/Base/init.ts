/*
  初始化的接口
*/
import Http from "./http";

export function reqConfigApi(initConfigParams: InitConfigParams): Promise<InitConfigRes> {
  return Http.ins.post({ route: "/config/v3.1/initSDK", data: initConfigParams });
}

export interface InitConfigParams {
  /* 平台分配给游戏的 appId */
  appId: number;
  /* 平台分配的渠道 advChannel*/
  advChannel: number;
  /* 平台来源 0 ios 1 android 2 网页支付 3 webPc */
  source: number;
  /* 网络 0 = wifi 1 = 3g 2 =  其他*/
  network: number;
  /* 机型,长度最长为50的字符串 */
  model: string;
  /* 操作系统,长度最长为50的字符串 */
  operatorOs: string
  /* 设备号,长度最长为50的字符串 */
  deviceNo: string;
  /* 设备,长度最长为50的字符串 (Android=MAC#ANDRIDID IOS=IDFA）*/
  device: string;
  /* 游戏版本,长度最长为30的字符串 */
  version: string
  /* SDK版本,长度最长为30的字符串 */
  sdkVersion: string;
  /* 客户端时间 (yyyy-MM-dd HH:mm:ss),长度最长为19的字符串 */
  clientTime: string;
  /* 0=非首次安装 1=首次安装  直接传 0 就好*/
  firstInstall: number;
  /* MD5(appId+source+advChannel+appKey) 长度最长为32的字符串 */
  sign: string;
}

export interface InitConfigRes {
  code: number,
  error_msg: string
  imageRootUrl: string,
  /* 消息列表 josn 字符串
  { loginMessageUrl: string; isHasLogin: string;
    isHasPause: string; pauseMessageUrl: string } */
  messages: string;
  /*
  悬浮按钮 josn 字符串
  [{"btnName":string,
  "btnNormalIcon":string,
  "btnNormalPressIcon":string,
  "btnRedIcon":string,
  "btnRedPressIcon":string,
  "btnUrl":string,
  "showRedSpots":string}]
  showRedSpots = 0不显示
  showRedSpots = 1显示
  */
  handlerBtns: string;
  /* 登陆方式 josn 字符串
   loginMethods: {
    loginMethod: string
    iconUrl: string
    loginUrl: string
    callBackUrl: string
    index: string
    rotate: number
  }[]
  */
  loginMethods: string;
  /*
  { // AES加密的 Json对象
    gpVerify: string
    gpProduct: string
  }
  */
  verifys: string;
  /* 广告渠道的参数 Json 对象
  { // android
    facebookAppId: string
    appsFlyerDevKey: string
    talkapp_key: string
    charboostAppId: string
    charboostAppSignature: string
    ewayAppId: string
    mobvistaSDKAppId: string
    admobConversionID: string
    admobValue: string
  }
  */
  advChannels: string;
  /*
    以上是微端的初始化参数
    这里是初始化jssdk的参数初始化参数
    publics 是一个json对象需要解析为对象,内部的参数按以下来配置
    publics: {
      // 所有的都要
      common: {
        // 游戏名,仅 web 端需要,引导添加到桌面
        name: "火影忍者H5",
        // facebook用于登录和分享的 Id
        fbAppId: "",
        // 卡考用来登录的参数
        kakao: "",
        // 游戏的语言
        language: "",
        // 是否自己打支付点,如果研发打支付点为false 反之为true 只能打官方支付的点,native使用
        isPurchasedMark: false
      },
      // 需要 悬浮球的填
      dom: {
          +++
        // 是否显示悬浮球
        isShow: true,
        // 悬浮球到顶部的rem值
        hoverTip: ".24",
        // 悬浮球初始贴左边还是右边
        hoverFromLeft: true,
      },
      // 需要打点的填
      mark: {
        // fb的广告打点 id
        fbId: "",
        // ga的广告打点 Id
        gaId: "",
        // adjustId
        adjustId: "",
        // adjust 打点的token 唯一点的点名必须带 unique
        eventToken: {

        }
      },
      pages: {
        // 游戏的首页 ,测试服用测试的首页,正式服用正式的首页
        rgIndex: "",
        // facebook 粉丝页
        fans: "",
        //  messenger 页 ,联系客服按钮打开的页面
        messenger: ""
      },
      // 联运需要,后面不要了,从调起支付来取
      uniteQuick: {
        // 支付的code
        code: 118,
        // 支付的channel
        channel: 37,
        //  用户渠道
        userChannel: 5,
        // 账户类型
        accountType: 3,
        appSecret: "",
        productCode: "",
        productKey: ""
      }
    } */
  publics: string;
}
