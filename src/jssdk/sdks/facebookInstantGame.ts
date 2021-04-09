import Base from './base';
import {initRG} from './rg';
import {fbShare} from '../utils/fb';
import {markInit} from '../plugins/mark';

/* 引入类型 */
import {GamePayParams} from './base';
import App from 'Src/jssdk/view2/App';

export default class FbInstantGameSdk extends Base {
  type: 5 = 5;
  app: App;
  isTest: boolean = false;
  get devicePromise() {
    return Promise.resolve({
      source: 3,
      network: 0,
      model: '0',
      operatorOs: '0',
      deviceNo: '0',
      device: '0',
      version: '0'
    });
  }
  constructor(config: ExtendedConfig) {
    super();
    super.init(config);
    this.mark = markInit({
      ga: config.markGAID,
      fb: config.markFBID,
      adjust: {id: config.adjustId, eventToken: config.adjustToken}
    });
    /* 挂载window.RG */
    initRG(this);
    this.init();
  }
  async init() {
    console.log('调启登录');
    // 挂载 dom
    const {Ins} = await import('../view2/index');
    this.app = Ins;
    this.initFbInstantGames();
  }
  mark: (
    markName: string,
    params?: {google?: any; adjust?: any; currency: string; money: string}
  ) => void;
  fbShare = fbShare;
  openFansPage() {
    window.open(this.config.fans);
  }
  async fbLogin(isLogout?: boolean) {
    const userID = FBInstant.player.getID() || 'test';
    const userFbRegisterInfo = {
      userId: userID,
      userName: userID,
      password: userID + 'oneFlower1WorldOneLeaf1Bodhi',
      accountType: 2,
      email: '',
      userChannel: 0,
      nickName: ''
    };
    return this.platformRegister(userFbRegisterInfo);
  }
  /**
   * 支付接口
   * @param paymentConfig
   */
  async pay(payParams: GamePayParams): Promise<ServerRes> {
    var paymentConfig = await this.getPaymentInfo(payParams);
    if (paymentConfig.code === 200) {
      var orderingData = paymentConfig.payments.find(payment => {
        return payment.name === 'Facebook';
      });
      var orderRes = await this.createOrder(orderingData);
      if (orderRes.code === 200) {
        var serverRes = await this.purchaseAsync(orderingData, orderRes);
        return serverRes;
      }
    }
  }

  /**
   * sdk 服务器消单完成
   * @param data
   * @param purchaseToken
   */
  serverFinishOrderCompleted(data: ServerRes, purchaseToken: string): Promise<ServerRes> {
    return this.consumePurchaseAsync(purchaseToken);
  }

  /**
   * facebook 消单
   * @param purchaseToken
   */
  consumePurchaseAsync(purchaseToken: string): Promise<ServerRes> {
    return new Promise((resolve, reject) => {
      FBInstant.payments
        .consumePurchaseAsync(purchaseToken)
        .then(function () {
          RG.Mark('sdk_purchased_done');
          this.app.showNotice(RG.jssdk.config.i18n.net_error_30200);
          resolve({
            code: 200,
            error_msg: ''
          });
        })
        .catch(err => {
          reject({
            code: 0,
            error_msg: 'consume purchase failure'
          });
        });
    });
  }

  /**
   * 获取未消单的订单信息
   */
  getPurchasesAsync() {
    FBInstant.payments.getPurchasesAsync().then(purchases => {
      if (purchases.length > 0) {
        // 存在未消单订单 需要进行消单
        purchases.forEach(purchase => {
          console.log('存在未消单订单 需要进行消单', purchases);
          purchases.forEach(purchase => {
            var {orderingData, orderRes} = JSON.parse(purchase.developerPayload);
            this.finishOrder({
              transactionId: orderRes.data.transactionId,
              channel: orderingData.channel,
              receipt: purchase.paymentID + '',
              signature: purchase.signedRequest,
              exInfo: ''
            }).then(serverRes => {
              this.serverFinishOrderCompleted(serverRes, purchase.purchaseToken);
            });
          });
        });
      }
    });
  }

  /**
   * 购买商品
   * @param payParams
   * @param orderingData
   * @param orderRes
   */
  purchaseAsync(orderingData, orderRes): Promise<ServerRes> {
    return new Promise(resolve => {
      var fbinstantPurchaseAsyncOption = {
        productID: orderingData.selectedProduct.productName,
        developerPayload: JSON.stringify({
          orderingData,
          orderRes
        })
      };
      console.log(
        '​FacebookInstantGames -> fbinstantPurchaseAsyncOption',
        fbinstantPurchaseAsyncOption
      );
      FBInstant.payments.purchaseAsync(fbinstantPurchaseAsyncOption).then(async purchase => {
        var serverRes = await this.finishOrder({
          transactionId: orderRes.data.transactionId,
          channel: orderingData.channel,
          receipt: purchase.paymentID + '',
          signature: purchase.signedRequest,
          exInfo: ''
        });
        if (serverRes.code === 200) {
          const finsishedRes = await this.serverFinishOrderCompleted(
            serverRes,
            purchase.purchaseToken
          );
          resolve(finsishedRes);
        }
      });
    });
  }

  private initFbInstantGames() {
    if (window.FBInstant) {
      this.FBInstantLoaded();
    } else {
      const srciptFBInstant = document.getElementById('FBInstant');
      srciptFBInstant &&
        (srciptFBInstant.onload = () => {
          window.FBInstant && this.FBInstantLoaded();
        });
    }
  }

  FBInstantLoaded() {
    Promise.race([
      new Promise(resolve => {
        FBInstant.initializeAsync().then(() => {
          resolve(false);
        });
      }),
      new Promise(resolve => {
        setTimeout(function () {
          resolve(true);
        }, 1000);
      })
    ]).then(isTest => {
      this.isTest = isTest as boolean;
      this.start();
    });
  }

  /**
   * FBInstant 初始化完成
   */
  start() {
    var delay = 300;
    var len = 2;
    var promise1 = new Promise<void>(resolve => {
      for (var i = 0; i <= len; i++) {
        setTimeout(
          i => {
            FBInstant.setLoadingProgress((i + 1) * 25);
            if (i === len)
              setTimeout(() => {
                resolve();
              }, delay);
          },
          i * delay,
          i
        );
      }
    });
    Promise.all([promise1, this.promise2]).then(() => {
      console.log('调启登录');
      this.fbLogin().then(loginRes => {
        console.log('登录完成');
        if (this.isTest) {
          this.app.showHover(false);
          window.rgAsyncInit && window.rgAsyncInit();
        } else {
          /**
           * 处理卡单
           */
          FBInstant.setLoadingProgress(100);
          if (loginRes.code === 200) {
            FBInstant.startGameAsync().then(() => {
              this.getPurchasesAsync();
              this.app.showHover(false);
              window.rgAsyncInit && window.rgAsyncInit();
            });
          }
        }
      });
    });
  }

  loginResolve;
  promise2 = new Promise(resolve => {
    this.loginResolve = resolve;
  });

  async Login() {
    this.loginResolve();
  }

  /**
   * 创建桌面快捷方式
   */
  CreateShortcut(): Promise<boolean> {
    return new Promise(resolve => {
      FBInstant.canCreateShortcutAsync()
        .then(function (canCreateShortcut) {
          if (canCreateShortcut) {
            FBInstant.createShortcutAsync()
              .then(function () {
                console.info('Shortcut created');
                resolve(true);
              })
              .catch(function (err) {
                console.error(err);
                resolve(false);
              });
          } else {
            console.error('can not CreateShortcut');
            resolve(false);
          }
        })
        .catch(function (err) {
          console.error(err);
          resolve(false);
        });
    });
  }
}
