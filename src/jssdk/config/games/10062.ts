import zh_cn from '../languages/zh_cn';
// 后端接口的域名 'https://nkds.bilivfun.com',
const configs: {
  default: Config;
  [key: number]: Partial<Config>;
} = {
  default: {
    // 加密参数
    appKey: 'f43968a73df747aab4b9b1e506265050',
    // facebook 应用 id
    fbAppId: '745760436156776',
    // 官方支付是否打点
    isPurchasedMark: false,
    // 粉丝页
    fans: 'https://www.facebook.com/BanCaPhatTai3D',
    language: 'zh_cn',
    i18n: zh_cn,
    hoverTop: '.24',
    hoverFromLeft: true
  }
};

export default configs;
