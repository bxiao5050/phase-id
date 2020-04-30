import {signed, formatDate} from '../utils';
import Http from '../api/Http';

export default class Payment {
  private appKey: string = '';
  /* 设置加密参数 */
  setAppKey(appKey: string) {
    this.appKey = appKey;
  }
  /* 获取支付的信息 */
  getPaymentConfig(params: PaymentConfigParams) {
    params.sign = signed([
      params.appId,
      params.advChannel,
      params.userId,
      params.gameCoin,
      params.level || 'null',
      params.source,
      params.network,
      this.appKey
    ]);
    return Http.ins.post<PaymentConfigRes>({route: '/config/paymentConfig/v4.0', data: params});
  }
  /* 第一次为空,后续为服务端返回的 lastTime */
  private lastTime: string = '0';
  private paymentList: GetPaymentHistoryRes['data'] = [];
  /* 获取支付的历史记录 */
  async getPaymentHistory(appId: string, userId: number) {
    const sign = signed([appId, userId, this.appKey]);
    const route = `/order/getOrderList/${appId}/${userId}/${this.lastTime}/${sign}`;
    const res = await Http.ins.get<GetPaymentHistoryRes>({route});
    if (this.lastTime === '0') {
      this.paymentList = res.data;
    } else {
      this.paymentList = this.paymentList.concat(res.data);
    }
    this.lastTime = res.lastTime;
    res.data = this.paymentList;
    return res;
  }
  /* 创建订单 */
  createOrder(params: CreateOrderParams) {
    params.clientTime = formatDate();
    params.sign = signed([
      params.appId,
      params.advChannel,
      params.userId,
      params.roleId,
      params.gameOrderId,
      params.gameZoneId,
      params.code,
      params.source,
      params.channel,
      params.amount,
      params.currency,
      params.productName,
      params.exInfo,
      this.appKey
    ]);
    return Http.ins.post<CreateOrderRes>({route: '/order/create/v4.0', data: params});
  }
  /* 消单 */
  finishOrder(params: FinishedOrderParams) {
    params.clientTime = formatDate();
    params.sign = signed([
      params.transactionId,
      params.receipt,
      params.signature,
      params.channel,
      params.advChannel,
      this.appKey
    ]);
    return Http.ins.post<FinishedOrderRes>({route: '/official/order/finish/v4.0', data: params});
  }
}
export interface PaymentConfigParams {
  /** 平台方分配给游戏的appId */
  appId: number;
  /** 0=appstore 1=google play 具体查看包常量表 */
  advChannel: number;
  /** 平台用户ID */
  userId: number;
  /** 游戏内角色id */
  roleId: string;
  /** 0=ios 1=android */
  source: number;
  // 网络 0=wifi 1 = 3g 2=其他
  network: number;
  /** 角色等级 */
  level: number;
  /** 游戏版本 控制每种支付方式的开关 */
  version: string;
  /** 游戏币数量 */
  gameCoin: number;
  /** 额外参数 */
  exInfo?: string;
  /** 验证参数MD5(appId+ advChannel+userId+gameCoin+level +source+ network +app_key) */
  sign: string;
}
export interface PaymentConfigRes extends ServerRes {
  payments: PaymentChannel[];
}
export interface GetPaymentHistoryRes extends ServerRes {
  lastTime: string;
  data: {
    // 交易流水
    transactionId: string;
    // 金额
    amount: string;
    // 货币类型
    currency: string;
    // 付方式 0=官方1=刮刮卡
    channel: number;
    // 	200成功，错误请见错误列表
    status: number;
    // chargingType 0=平台币 1=直冲
    chargingType: number;
    // 客户端时间
    clientDate: number;
  }[];
}

export interface Product {
  // 金额
  amount: number;
  // 货币单位 USD
  currency: string;
  // 折扣描述
  discountDesc?: string;
  // 游戏货币数量
  gameCoin: number;
  // 游戏货币单位
  gameCurrency: string;
  /* 商品类型 0~10 普 通商品，其他按需 分配 */
  itemType: number;
  // 商品描述，显示的商品名，支持富文本
  productDesc: string;
  /* 商品名称（对应研 发商品 id） */
  productName: string;
  // 货币单位的缩写，$
  shortCurrency: string;
}
export interface PaymentChannel {
  /* 支付方式的显示的名称 */
  name: string;
  /* "description": "短代" 支付方式的描述 */
  description: string;
  /* 支付渠道 */
  channel: number;
  /* 支付方式 code 值 */
  code: number;
  /* 支付方式 icon图片 */
  codeImg: string;
  // 推荐位图片名称
  hotImg?: string;
  // 折扣率图片名称
  discountImg?: string;
  //是否显示商品列表 ：1=显示，0= 不显示
  showProductList: 0 | 1;
  /*
  showMethod（显示方式）：
    0、网页打开，
    1、显示序列号和 PIN 码，
    2、只显示 PIN 码，
    3、显示支付确认界面，调用 SDK（商品金额不可修改），
    4、九宫格展示支付方式，
    5、显示支付确认界面，调起 SDK（可以修改商品金额），
    6、显示内容，
    7、显示不可修改金额的支付确认界面，
    8、显示商品列表，
    9、显示支付确认界面且网页打开，
    10、显示支付确认界面且显示序列号和 PIN 码，
    11、显示支付确认界面且显示 PIN 码。
    showProductList（是否显示商品列表）：0、不显示，1、显示。
    hotImg：推荐位图片名称。
    discountImg：折扣率图片名称
  */
  showMethod: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  /* "exInfo": "vietnamANPAY" */
  exInfo: string;
  /* 0=第三方，1=官方 */
  isOfficial: number;
  //选中的商品
  selectedProduct: Product;
  //商品列表
  products: Product[];
  /* 支付渠道 */
  nodes?: PaymentChannel[];

  isFacebook?: boolean;
}
export interface CreateOrderParams {
  /** 平台方分配给游戏的appId */
  appId: number;
  /** 0=appstore 1=google play 具体查看包常量表 */
  advChannel: number;
  /** 平台用户ID */
  userId: number;
  /** 游戏订单ID */
  gameOrderId: string;
  /** 游戏区服ID */
  gameZoneId: string;
  /** 角色ID */
  roleId: string;
  /** 角色ID */
  roleName: string;
  /** 角色等级 */
  level: number;
  /** 充值来源 0=ANDROID客户端 1=IOS客户端 2=网页 */
  source: number;
  /** 支付渠道 0=appstore 1=google play 2=vnpt 3=1pay 4=mol,具体见渠道常量表 */
  channel: number;
  /** CODE值，具体见支付方式常量表 */
  code: number;
  /** 金额 */
  amount: number;
  /** 货币 */
  currency: string;
  /** 商品名称 */
  productName: string;
  /** 0=第三方，1=官方 */
  isOfficial: number;
  /** 设备号 */
  deviceNo: string;
  /** Android:MAC地址 IOS:IDFA */
  device: string;
  /** 网络 0=wifi 1 = 3g 2=其他 */
  network: number;
  /** 机型 */
  model: string;
  /** 操作系统，例如Android4.4 */
  operatorOs: string;
  /** 游戏版本 */
  version: string;
  /** SDK版本号 */
  sdkVersion: string;
  /** 客户端提交时间 "yyyy-MM-dd hh:mm:ss" */
  clientTime: string;
  /** 商品类型：0=普通商品，1=月卡，2=年卡.... */
  itemType: number;
  /** 额外的信息，如果是刮刮卡,它的格式是{“serialNo”:””,”pin”:””}JSON字符串 */
  exInfo: string;
  /** 参数签名结果 MD5(appId+advChannel+userId+roleId+gameOrderId+gameZoneId+code+source+channel+amount+currency+productName + exInfo +app_key)
   */
  sign: string;
}
export interface CreateOrderRes extends ServerRes {
  data: {
    // double	成功，则返回金额(实际支付的金额)
    money?: number;
    // String	成功，则返回货币（实际支付的货币）
    currency?: string;
    // String	游戏订单ID(SDK订单交易ID)
    transactionId: string;
    // String	额外信息，如果返回url格式为："returnInfo" ：{ "url": "https://hao.360.cn/?z1002" }
    returnInfo?: {url: string};
  };
}
export interface FinishedOrderParams {
  /** 交易流水 */
  transactionId: string;
  /** APPSTORE单据或者Google play signatureData */
  receipt: string;
  /** Google play signature */
  signature: string;
  /** 支付方式 0=appstore 1=google play 2=vnpt 3=1pay 4=mol 28=facebook */
  channel: number;
  /** 包ID */
  advChannel: number;
  /** 设备号 */
  deviceNo: string;
  /** Android: MAC地址 IOS: IDFA */
  device: string;
  /** 网络 0 = wifi 1 = 3g 2 = 其他 */
  network: number;
  /** 机型 */
  model: string;
  /** 操作系统，例如Android4.4 */
  operatorOs: string;
  /** 游戏版本 */
  version: string;
  /** SDK版本 */
  sdkVersion: string;
  /** 客户端提交时间 "yyyy-MM-dd hh:mm:ss" */
  clientTime: string;
  /** 额外的信息 */
  exInfo?: string;
  /** 参数签名结果 MD5(transactionId + receipt + signature + channel + advChannel + app_key) */
  sign: string;
}
export interface FinishedOrderRes extends ServerRes {
  // double	成功，则返回金额（实际支付金额）
  money: number;
  // String	成功，则返回货币（实际支付货币）
  currency: string;
  // 	String	交易ID
  transactionId: string;
}
