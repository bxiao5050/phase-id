import * as CryptoJS from 'crypto-js';
import {signed} from '../utils';
import Http from '../api/Http';

export default class Init {
  private appKey: string = '';
  /* 设置加密参数 */
  setAppKey(appKey: string) {
    this.appKey = appKey;
  }
  getConfig(params: InitConfigParams) {
    params.sign = signed([params.appId, params.source, params.advChannel, this.appKey]);
    return Http.ins
      .post<InitConfigRes>({route: '/config/v3.1/initSDK', data: params})
      .then(res => {
        if (res.code === 200) {
          const verifys: {gpVerify: string; gpProduct: string} = JSON.parse(
            this.AESdecode(res.verifys)
          );
          return {
            appId: params.appId,
            advChannel: params.advChannel,
            gpProduct: verifys.gpProduct,
            gpVerify: verifys.gpVerify,
            gpPluginAction: res.publics.gpPluginAction,
            gpPluginGpUrl: res.publics.gpPluginGpUrl,
            gpPluginType: res.publics.gpPluginType,
            gpPluginName: res.publics.gpPluginName,
            gpPluginLoadingUrl: res.publics.gpPluginLoadingUrl
          };
        } else {
          return Promise.reject(res);
        }
      });
  }
  // 官方支付的加密参数
  key = CryptoJS.enc.Utf8.parse('flowerwordchangi');
  iv = CryptoJS.enc.Utf8.parse('0392039203920300');
  AESdecode(srcStr: string) {
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
  };
}
