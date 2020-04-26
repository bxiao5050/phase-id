import Base from './base';
import {loadReactJs, getUrlOrigin} from '../utils';
import {initRG} from './rg';
import {fbWebLogin, fbShare} from '../utils/fb';

/* 引入类型 */
import {GamePayParams} from './base';
import {PaymentChannel} from '../api/payment';
import App from 'Src/jssdk/view/App';
import {FbLoginRes} from './native/android';
import Account from '../api/account';

/* 与首页postMessage 的通信, 添加到桌面 */
export default class WebSdk extends Base {
  type: 1;
  app: App;
  getUserResolve = null;
  getUserPromise: Promise<any>;
  devicePromise = Promise.resolve({
    source: 3,
    network: 0,
    model: '0',
    operatorOs: '0',
    deviceNo: '0',
    device: '0',
    version: '0'
  });

  constructor(config: ExtendedConfig) {
    super();
    /* 向成员类分发参数 */
    super.init(config);
    /* 挂载window.RG */
    initRG(this);

    // 获取 userId 数组
    const userIdArr = Object.keys(this.account.users);
    let hasUser = userIdArr.length > 0 ? true : false;
    if (!hasUser) {
      this.getUserPromise = this.getUser();
    } else {
      this.getUserPromise = Promise.resolve();
    }
  }

  async init() {
    /* web 端将用户信息保存在游戏首页中 */
    this.account.saveHandle = function (this: Account) {
      let data = {action: 'set', data: {user: this.user, users: this.users}};
      window.parent.postMessage(JSON.stringify(data), getUrlOrigin(RG.jssdk.config.indexUrl));
    };
    /* 加载 react-js  */
    await loadReactJs();
    /* 加载 dom */
    const {Ins} = await import('../view/index');
    // 挂载 dom
    this.app = Ins;
    /* 判断是否自动登录,切换账号, 还是 fbLogin*/
    await this.getUserPromise;
    if (window.name === 'redirect') {
      window.name = '';
      this.app.showLogin();
    } else {
      let user = this.account.user;
      if (!user) {
        const userIdArr = Object.keys(this.account.users);
        if (userIdArr.length > 0) user = this.account.users[userIdArr[0]];
      }
      await RG.jssdk.platformLogin(user.userName, user.password);
      const loginModule = this.app.showLogin();
      loginModule.loginComplete();
    }
  }

  getUser() {
    /* 注册从首页接收用户信息的回调 */
    window.addEventListener('message', getUserInfoFromIndex, false);
    return new Promise((resolve, reject) => {
      this.getUserResolve = resolve;
      window.parent.postMessage(
        JSON.stringify({action: 'get'}),
        getUrlOrigin(RG.jssdk.config.indexUrl)
      );
    });
  }
  async pay(params: GamePayParams) {
    return this.getPaymentInfo(params).then(res => {
      res.payments.length && this.app.showPayment(res);
    });
  }
  mark(markName: string, params?: {userId?: number; money: string; currency: string}) {
    const data = {action: 'mark', data: {name: markName, param: params}};
    window.parent.postMessage(JSON.stringify(data), getUrlOrigin(RG.jssdk.config.indexUrl));
  }
  async fbLogin(isLogout: boolean) {
    return fbWebLogin().then((res: FbLoginRes) => {
      return this.platformRegister(res);
    });
  }
  fbShare = fbShare;
  openFansPage() {
    window.open(this.config.fans);
  }
  install = install;
}
/* 从首页加载用户信息 */
function getUserInfoFromIndex(event: MessageEvent) {
  let origin = getUrlOrigin(RG.jssdk.config.indexUrl);
  if (event.origin !== origin || event.data === 'rgclose') return;
  RG.jssdk.account.init(JSON.parse(event.data));
  (RG.jssdk as WebSdk).getUserResolve();
}
function install() {
  let link = RG.jssdk.config.indexUrl;
  const {language, name, iosDonloadUrl, androidDonloadUrl} = RG.jssdk.config;
  const {appId, sdkVerison} = RG.jssdk.config.urlParams;
  let url: string;
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    if (iosDonloadUrl) {
      url = iosDonloadUrl;
    } else {
      url = `${SERVER}/jssdk/${sdkVerison}/add-shortcut.html?language=${language}&system=ios&appId=${appId}&link=${link}`;
    }
  } else if (/(Android)/i.test(navigator.userAgent)) {
    if (androidDonloadUrl) {
      url = androidDonloadUrl;
    } else {
      url = `${SERVER}/jssdk/${sdkVerison}/add-shortcut.html?language=${language}&system=android&appId=${appId}&link=${link}`;
    }
  } else {
    url = `${SERVER}/platform/shortcut.jsp?link=${encodeURIComponent(
      link + '?shortcut=true'
    )}&fileName=${name}&t=${Date.now()}`;
  }
  console.info(url);
  window.open(url);
}
