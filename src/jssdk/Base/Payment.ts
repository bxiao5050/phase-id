
import Http from "./Http";
import { signed, formatDate } from "../utils";

export default class Payment {
  static _ins: Payment
  static get instance(): Payment {
    return this._ins || new Payment;
  }
  constructor() {
    Payment._ins = this
  }

  private route = {
    config: "/config/paymentConfig/v4.0",
    createOrder: "/order/create/v4.0",
    history: "/order/getOrderList",
    finish: "/official/order/finish/v4.0"
  }

  async getPaymentConfig(PaymentConfig: PaymentConfig) {

    var deviceMsg = await JsToNative.getDeviceMsgAsync()

    var data: PaymentConfigParams = {
      appId: RG.jssdk.config.appId,
      advChannel: RG.jssdk.config.advChannel,
      userId: RG.jssdk.CurUserInfo().userId,
      roleId: PaymentConfig.roleId,
      source: deviceMsg.source,
      version: deviceMsg.version,
      network: deviceMsg.network,
      level: PaymentConfig.level,
      gameCoin: PaymentConfig.gameCoin,
      sign: null
    }
    data.sign = signed([
      data.appId,
      data.advChannel,
      data.userId,
      data.gameCoin,
      data.level || "null",
      data.source,
      data.network,
      RG.jssdk.config.app_key
    ])

    return Http.ins.post({
      route: this.route.config,
      data
    }).then((paymentConfigRes: PaymentConfigRes) => {
      if (paymentConfigRes.code !== 200) {
        console.error('​Payment -> getPaymentConfig -> paymentConfigRes', paymentConfigRes);
      }
      return paymentConfigRes
    })
  }

  public getPaymentHistory(): Promise<any> {
    var data = {
      appId: RG.jssdk.config.appId,
      userId: RG.jssdk.CurUserInfo().userId,
      lastTime: 1525771365401,
      sign: signed([
        RG.jssdk.config.appId,
        RG.jssdk.CurUserInfo().userId,
        RG.jssdk.config.app_key
      ])
    }

    return Http.ins.get({ route: this.route.history + '/' + Object.keys(data).map(key => data[key]).join('/') }).then((history) => {
      return history
    })
  }

  async createOrder(paymentConfig: PaymentConfig, createOrderParams: {
    channel: number
    code: number
    amount: string
    currency: string
    productName: string
    itemType: number
    isOfficial: number
    exInfo?: string
  }): Promise<OrderRes> {
    var deviceMsg = await JsToNative.getDeviceMsgAsync()
    console.log('createOrder', paymentConfig, createOrderParams)
    var data: CreateOrderParams = {
      channel: createOrderParams.channel,
      code: createOrderParams.code,
      amount: createOrderParams.amount,
      currency: createOrderParams.currency,
      productName: createOrderParams.productName,
      itemType: createOrderParams.itemType,
      isOfficial: createOrderParams.isOfficial,
      exInfo: createOrderParams.exInfo ? createOrderParams.exInfo : "0",
      appId: RG.jssdk.config.appId,
      advChannel: RG.jssdk.config.advChannel,
      userId: RG.jssdk.CurUserInfo().userId,
      gameOrderId: paymentConfig.gameOrderId + '',
      gameZoneId: paymentConfig.gameZoneId + '',
      roleId: paymentConfig.roleId + '',
      roleName: paymentConfig.roleName,
      level: paymentConfig.level + '',
      source: deviceMsg.source,
      deviceNo: deviceMsg.deviceNo,
      device: deviceMsg.device,
      network: deviceMsg.network,
      model: deviceMsg.model,
      operatorOs: deviceMsg.operatorOs,
      version: deviceMsg.version,
      sdkVersion: RG.jssdk.version,
      clientTime: formatDate(),
      sign: null
    }

    data.sign = signed([
      data.appId,
      data.advChannel,
      data.userId,
      data.roleId,
      data.gameOrderId,
      data.gameZoneId,
      data.code,
      data.source,
      data.channel,
      data.amount,
      data.currency,
      data.productName,
      data.exInfo,
      RG.jssdk.config.app_key
    ])

    return Http.ins.post({ route: this.route.createOrder, data }).then((orderRes: OrderRes) => {
      if (orderRes.code !== 200) {
        console.error('​Payment -> createOrder -> orderRes', orderRes);
      }
      return orderRes
    })
  }

  /** 官方充值完成订单（消单接口） */
  public async finishOrder(finishOrderParams: FinishOrderParams) {
    var deviceMsg = await JsToNative.getDeviceMsgAsync()
    var { version, deviceNo, device, network, model, operatorOs } = deviceMsg
    var finishOrderPostData: FinishOrderPostData = {
      transactionId: finishOrderParams.transactionId,
      channel: finishOrderParams.channel,
      exInfo: finishOrderParams.exInfo || '',
      receipt: finishOrderParams.receipt,
      signature: finishOrderParams.signature,

      advChannel: RG.jssdk.config.advChannel,
      sdkVersion: RG.jssdk.version,
      clientTime: formatDate(),

      version: version,
      deviceNo: deviceNo,
      device: device,
      network: network,
      model: model,
      operatorOs: operatorOs,

      sign: signed([
        finishOrderParams.transactionId,
        finishOrderParams.receipt,
        finishOrderParams.signature,
        finishOrderParams.channel,
        RG.jssdk.config.advChannel,
        RG.jssdk.config.app_key

      ])
    }
    return Http.ins.post({ route: this.route.finish, data: finishOrderPostData }).then((serverRes: ServerRes) => {
      if (serverRes.code !== 200) {
        console.error('​Payment -> finishOrder -> serverRes', serverRes);
      }
      return serverRes
    })
  }

}

interface FinishOrderPostData {
  /** 交易流水 */
  transactionId: string
  /** APPSTORE单据或者Google play signatureData */
  receipt: string
  /** Google play signature */
  signature: String
  /** 支付方式 0=appstore 1=google play 2=vnpt 3=1pay 4=mol 28=facebook */
  channel: number
  /** 包ID */
  advChannel: number
  /** SDK版本 */
  sdkVersion: string
  /** 客户端提交时间 "yyyy-MM-dd hh:mm:ss" */
  clientTime: string
  /** 参数签名结果 MD5(transactionId + receipt + signature + channel + advChannel + app_key) */
  sign: string
  /** 设备号 */
  deviceNo: string
  /** Android: MAC地址 IOS: IDFA */
  device: string
  /** 网络 0 = wifi 1 = 3g 2 = 其他 */
  network: number
  /** 机型 */
  model: string
  /** 操作系统，例如Android4.4 */
  operatorOs: string
  /** 游戏版本 */
  version: string
  /** 额外的信息 */
  exInfo?: string
}

interface PaymentConfigParams {
  /** 平台方分配给游戏的appId */
  appId: number
  /** 0=appstore 1=google play 具体查看包常量表 */
  advChannel: number
  /** 平台用户ID */
  userId: number
  /** 游戏内角色id */
  roleId: number
  /** 0=ios 1=android */
  source: number
  // 网络 0=wifi 1 = 3g 2=其他
  network: number
  /** 角色等级 */
  level: number
  /** 游戏版本 控制每种支付方式的开关 */
  version: string
  /** 游戏币数量 */
  gameCoin: number
  /** 额外参数 */
  exInfo?: string
  /** 验证参数MD5(appId+ advChannel+userId+gameCoin+level +source+ network +app_key) */
  sign: string
}

interface CreateOrderParams {
  /** 平台方分配给游戏的appId */
  appId: number
  /** 0=appstore 1=google play 具体查看包常量表 */
  advChannel: number
  /** 平台用户ID */
  userId: number
  /** 游戏订单ID */
  gameOrderId: string
  /** 游戏区服ID */
  gameZoneId: string
  /** 角色ID */
  roleId: string
  /** 角色ID */
  roleName: string
  /** 角色等级 */
  level: string
  /** 充值来源 0=ANDROID客户端 1=IOS客户端 2=网页 */
  source: number
  /** 支付渠道 0=appstore 1=google play 2=vnpt 3=1pay 4=mol,具体见渠道常量表 */
  channel: number
  /** CODE值，具体见支付方式常量表 */
  code: number
  /** 金额 */
  amount: string
  /** 货币 */
  currency: string
  /** 商品名称 */
  productName: string
  /** 商品类型：0=普通商品，1=月卡，2=年卡.... */
  itemType: number
  /** 0=第三方，1=官方 */
  isOfficial: number
  /** 设备号 */
  deviceNo: string
  /** Android:MAC地址 IOS:IDFA */
  device: string
  /** 网络 0=wifi 1 = 3g 2=其他 */
  network: number
  /** 机型 */
  model: string
  /** 操作系统，例如Android4.4 */
  operatorOs: string
  /** 游戏版本 */
  version: string
  /** SDK版本号 */
  sdkVersion: string
  /** 客户端提交时间 "yyyy-MM-dd hh:mm:ss" */
  clientTime: string
  /** 额外的信息，如果是刮刮卡,它的格式是{“serialNo”:””,”pin”:””}JSON字符串 */
  exInfo: string
  /** 参数签名结果 MD5(appId+advChannel+userId+roleId+gameOrderId+gameZoneId+code+source+channel+amount+currency+productName + exInfo +app_key)
  */
  sign: string
}

