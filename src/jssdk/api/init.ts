import {signed, getParameterByName, initDebugger} from '../utils';
import Http from '../api/Http';

type Publics = InitConfigRes['publics'];
export default class Init {
  private appKey: string = '';
  /* 设置加密参数 */
  setAppKey(appKey: string) {
    this.appKey = appKey;
  }
  async getConfig(params: InitConfigParams) {
    params.sign = signed([params.appId, params.source, params.advChannel, this.appKey]);
    return Http.ins
      .post<InitConfigRes>({route: '/config/v3.1/initSDK', data: params})
      .then(async res => {
        if (res.code === 200) {
          const verifys: {gpVerify: string; gpProduct: string} = JSON.parse(
            this.AESdecode(res.verifys)
          );
          /* 是否要加载VConsole */
          if (res.publics && res.publics.consoleIp) {
            const user = JSON.parse(localStorage.getItem('user'));
            const userIds = res.publics.consoleIp.split(',');
            if (
              (user && userIds.indexOf(user.userId + '') !== -1) ||
              getParameterByName('debugger')
            ) {
              await initDebugger();
            }
          }
          return {
            appId: params.appId,
            advChannel: params.advChannel,
            gpProduct: verifys.gpProduct,
            gpVerify: verifys.gpVerify,
            gpPluginAction: this.hasProp(res, 'gpPluginAction'),
            gpPluginGpUrl: this.hasProp(res, 'gpPluginGpUrl'),
            gpPluginType: this.hasProp(res, 'gpPluginType'),
            gpPluginName: this.hasProp(res, 'gpPluginName'),
            gpPluginLoadingUrl: this.hasProp(res, 'gpPluginLoadingUrl'),
            popUpSwitch: this.hasProp(res, 'popUpSwitch') as '0' | '1',
            popUpInterval: this.hasProp(res, 'popUpInterval'),
            rewardUrl: this.hasProp(res, 'rewardUrl'),
            fbUrl: this.hasProp(res, 'fbUrl'),
            firstPopUpInterval: this.hasProp(res, 'firstPopUpInterval')
          };
        } else {
          return Promise.reject(res);
        }
      });
  }
  hasProp<T extends keyof Publics>(res: InitConfigRes, propName: T): Publics[T] {
    return res.publics && res.publics[propName];
  }
  // 官方支付的加密参数
  private key = CryptoJS.enc.Utf8.parse('flowerwordchangi');
  private iv = CryptoJS.enc.Utf8.parse('0392039203920300');
  private AESdecode(srcStr: string) {
    return CryptoJS.AES.decrypt(srcStr, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  }
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
  operatorOs: string;
  /* 设备号,长度最长为50的字符串 */
  deviceNo: string;
  /* 设备,长度最长为50的字符串 (Android=MAC#ANDRIDID IOS=IDFA）*/
  device: string;
  /* 游戏版本,长度最长为30的字符串 */
  version: string;
  /* SDK版本,长度最长为30的字符串 */
  sdkVersion: string;
  /* 客户端时间 (yyyy-MM-dd HH:mm:ss),长度最长为19的字符串 */
  clientTime: string;
  /* 0=非首次安装 1=首次安装  直接传 0 就好*/
  firstInstall: number;
  /* MD5(appId+source+advChannel+appKey) 长度最长为32的字符串 */
  sign: string;
}

export interface InitConfigRes extends ServerRes {
  imageRootUrl: string;
  messages: {
    isHasLogin: string; //"false"
    loginMessageUrl: string;
    isHasPause: string; //"false"
    pauseMessageUrl: string;
  };
  handlerBtns: {
    btnName: string;
    btnNormalIcon: string;
    btnNormalPressIcon: string;
    btnRedIcon: string;
    btnRedPressIcon: string;
    btnUrl: string;
    /* showRedSpots = 0不显示 showRedSpots = 1显示 */
    showRedSpots: string;
  }[];
  loginMethods: {
    loginMethod: string;
    iconUrl: string;
    loginUrl: string;
    callBackUrl: string;
    index: string;
    rotate: number;
  }[];
  verifys: string;
  advChannels: {
    admobConversionID: string;
    appleAppID: string;
    admobLabel: string;
    admobValue: string;
    admobIsRepeatable: string;
    appsFlyerDevKey: string;
    admobOperator: string;
    facebookAppId: string;
  };
  publics: {
    /* android 的支付插件 */
    NganluongUrl?: string;
    gpPluginGpUrl?: string;
    gpPluginAction?: string;
    gpPluginLoadingUrl?: string;
    gpPluginType?: string;
    gpPluginName?: string;
    consoleIp?: string;
    // firstPopUpInterval 游客注册的第一次的弹窗时间
    firstPopUpInterval: string;
    // 游客升级弹窗开关  0 关  1开
    popUpSwitch?: '0' | '1';
    // 弹窗间隔  单位秒
    popUpInterval?: string;
    // 游客升级奖励页面
    rewardUrl: string;
    // facebook 粉丝页
    fbUrl: string;
  };
}
