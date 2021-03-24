import Base from './base';
import {initRG} from './rg';
import {fbWebLogin, fbShare} from '../utils/fb';
import {markInit} from '../plugins/mark';

/* 引入类型 */
import {GamePayParams} from './base';
import App from 'Src/jssdk/view2/App';
import {FbLoginRes} from './native/android';

export default class FbWebGameSdk extends Base {
  type: 4 = 4;
  app: App;
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
    var loginRes = await this.fbLogin();
    if (loginRes.code === 200) {
      /**
       * 处理卡单
       */
      this.fbAsyncInit();
      this.app.showHover(false);
      window.rgAsyncInit && window.rgAsyncInit();
    }

    RG.Mark('sdk_loaded');
  }
  fbAsyncInit() {
    this.getPurchasesAsync();
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
    return fbWebLogin().then((res: FbLoginRes) => {
      return this.platformRegister(res);
    });
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
      FB.api(
        '/' + purchaseToken + '/consume', // Replace the PURCHASE_TOKEN
        'post',
        {
          // access_token: access_token
        },
        ({success}) => {
          if (success) {
            // facebook 消单成功
            RG.Mark('sdk_purchased_done');
            this.app.showNotice(RG.jssdk.config.i18n.net_error_30200);
            resolve({
              code: 200,
              error_msg: ''
            });
          } else {
            reject({
              code: 0,
              error_msg: 'consume purchase failure'
            });
          }
        }
      );
    });
  }

  /**
   * 获取未消单的订单信息
   */
  getPurchasesAsync() {
    /**
     * https://developers.facebook.com/docs/games_payments/payments_lite
     */
    FB.api(
      '/app/purchases',
      'get',
      {
        // access_token: 'ACCESS_TOKEN'
      },
      (payload: {
        data: {
          app_id: number;
          developer_payload: string;
          payment_id: number;
          product_id: string;
          purchase_time: number;
          purchase_token: string;
          signed_request: string;
        }[];
        paging: {
          cursors: {
            after: string;
            before: string;
          };
        };
      }) => {
        if (payload.data.length > 0) {
          // 存在未消单订单 需要进行消单
          console.log('存在未消单订单 需要进行消单', payload);
          payload.data.forEach(data => {
            var {orderingData, orderRes} = JSON.parse(data.developer_payload);
            this.finishOrder({
              transactionId: orderRes.data.transactionId,
              channel: orderingData.channel,
              receipt: data.payment_id + '',
              signature: data.signed_request,
              exInfo: ''
            }).then(serverRes => {
              this.serverFinishOrderCompleted(serverRes, data.purchase_token);
            });
          });
        }
      }
    );
  }

  /**
   * 购买商品
   * @param payParams
   * @param orderingData
   * @param orderRes
   */
  purchaseAsync(orderingData, orderRes): Promise<ServerRes> {
    return new Promise(resolve => {
      FB.ui(
        {
          method: 'pay',
          action: 'purchaseiap',
          product_id: orderingData.selectedProduct.productName,
          developer_payload: JSON.stringify({
            orderingData,
            orderRes
          })
        },
        async purchase => {
          if (purchase && !purchase.error_code) {
            var serverRes = await this.finishOrder({
              transactionId: orderRes.data.transactionId,
              channel: orderingData.channel,
              receipt: purchase.payment_id + '',
              signature: purchase.signed_request,
              exInfo: ''
            });
            if (serverRes.code === 200) {
              const finishedRes = await this.serverFinishOrderCompleted(
                serverRes,
                purchase.purchase_token
              );
              resolve(finishedRes);
            }
          }
        }
      );
    });
  }
}
