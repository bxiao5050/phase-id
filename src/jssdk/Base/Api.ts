import * as Const from './Constant';
import {signed} from '../utils';
import Http from './Http';

export class Api {
  static _ins: Api;
  static get instance(): Api {
    return this._ins || new Api();
  }
  constructor() {
    Api._ins = this;
  }

  private route = {
    bind: Const.RouteBindZone,
    bindVisitor: Const.RouteBindVisitor
  };

  /** 绑定区服 */
  public async Bind(BindZoneParam: BindZoneParam) {
    var deviceMsg = await JsToNative.getDeviceMsgAsync();

    var data = Object.assign(deviceMsg, BindZoneParam, {
      sign: signed([
        BindZoneParam.userId,
        RG.jssdk.config.appId,
        BindZoneParam.gameZoneId,
        deviceMsg.source,
        RG.jssdk.config.app_key
      ])
    });
    return Http.ins.post({route: this.route.bind, data}).then(data => {
      return data;
    });
  }
  /*  绑定游客 */
  public BindVisitor(account: string, password: string) {
    var data = {
      appId: RG.jssdk.config.appId,
      userId: RG.CurUserInfo().userId,
      userName: account,
      password: password,
      email: '',
      sign: signed([
        RG.jssdk.config.appId,
        RG.CurUserInfo().userId,
        account,
        password,
        RG.jssdk.config.app_key
      ])
    };
    return Http.ins.post({route: this.route.bindVisitor, data}).then(data => {
      if (data.code === 200) {
        var userInfo = RG.jssdk.Account.user;

        userInfo.userName = account;
        RG.jssdk.Account.user = userInfo;
      }
      return data;
    });
  }
}

interface getRoleParams {
  appId: string;
  userId: number;
  gameZoneId: number;
  appSecret: string;
}
interface getRoleInfoRes extends ServerRes {
  data: {
    roleId: string;
    roleName: string;
    roleLevel: string;
    state: number;
    createTime: string;
    lastLoginTime: string;
    vipLevel: string;
    gameCoinTotal: string;
  }[];
}
export function getRoleInfo({appId, userId, gameZoneId, appSecret}: getRoleParams) {
  // userId+gameZoneId+timestamp+appSecret
  const timestamp = Date.now();
  const sign = signed([userId, gameZoneId, timestamp, appSecret]);
  const route = `/user/role?appId=${appId}&userId=${userId}&gameZoneId=${gameZoneId}&timestamp=${timestamp}&sign=${sign}`;
  return Http.ins.get<getRoleInfoRes>({route});
}

interface VerifyTokenParams {
  /* 平台分配的appId */
  appId: string;
  /* 平台分配的游戏渠道 */
  advChannel: string;
  /* quick用户id */
  uid: string;
  /* quick 登录的 token */
  token: string;
  // md5(appId,uid,token,appSecret) appSecret 平台分配的加密参数
  sign: string;
}
/* quick 登录校验 */
export function verifyToken({appId, advChannel, uid, token, sign}: VerifyTokenParams) {
  const route = `/quick/verifyToken/${appId}/${advChannel}/${encodeURIComponent(
    uid
  )}/${encodeURIComponent(token)}/${encodeURIComponent(sign)}`;
  return Http.ins.get({route});
}

// facebook 登录
export function fbShare(shareUrl: string) {
  console.info('facebook share' + shareUrl);
  if (!shareUrl) return Promise.reject('url is not find.');
  return new Promise((resolve, reject) => {
    FB.ui({method: 'share', href: shareUrl, display: 'popup'}, function(shareDialogResponse) {
      if (shareDialogResponse) {
        if (shareDialogResponse.error_message) {
          resolve({
            code: 0,
            error_msg: shareDialogResponse.error_message
          });
        } else {
          resolve({
            code: 200
          });
        }
      } else {
        resolve({
          code: 0
        });
      }
    });
  });
}

export function reqConfigApi(initConfigParams: InitConfigParams){
  return Http.ins.post<InitConfigRes>({ route: "/config/v3.1/initSDK", data: initConfigParams });
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
  /* 0=非首次安装 1=首次安装 */
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
