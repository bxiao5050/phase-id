import Mock from 'mockjs';

const Random = Mock.Random;

export function getFinishOrderRes(options) {
  console.log(JSON.stringify({url: options.url, type: options.type, body: options.body}));
  const result = {
    code: 200,
    error_msg: 'success',
    money: 19.99,
    currency: 'USD',
    transactionId: 'QS007',
  };
  return result;
}
export function getCreateOrderRes(options) {
  console.log(JSON.stringify({url: options.url, type: options.type, body: options.body}));
  const result = {
    code: 200,
    error_msg: 'success',
    data: {
      money: 15.99,
      currency: 'USD',
      transactionId: 'ES123456',
      returnInfo: {
        url: 'http://www.baidu.com',
      },
    },
  };
  return result;
}
export function getPaymentConfigRes(options) {
  console.log(JSON.stringify({url: options.url, type: options.type, body: options.body}));
  // 10062 1
  const result = {
    code: 200,
    error_msg: 'success',
    payments: [
      {
        name: 'SMS',
        description: '短代',
        channel: 30,
        code: 104,
        codeImg: 'http://sdk-test.changic.net.cn:8191/image/card/104.png',
        hotImg: 'vista.png',
        discountImg: 'disCount.png',
        showMethod: 0,
        showProductList: 1,
        isOfficial: 0,
        selectedProduct: {
          productName: 'product_pkcentury_sms_30',
          productDesc: '一箱钻石',
          discountDesc: '钻石',
          amount: 2000.0,
          currency: 'VND',
          shortCurrency: '₫',
          gameCoin: 50,
          gameCurrency: 'Diamonds',
          itemType: 0,
        },
        products: [
          {
            productName: 'product_pkcentury_sms_5',
            productDesc: '一箱',
            discountDesc: '钻石',
            amount: 1000.0,
            currency: 'VND',
            shortCurrency: '₫',
            gameCoin: 20,
            gameCurrency: 'Diamonds',
            itemType: 0,
          },
          {
            productName: 'product_pkcentury_sms_30',
            productDesc: '一箱钻石',
            discountDesc: '钻石',
            amount: 2000.0,
            currency: 'VND',
            shortCurrency: '₫',
            gameCoin: 50,
            gameCurrency: 'Diamonds',
            itemType: 0,
          },
        ],
      },
      {
        name: 'Card',
        description: '',
        channel: -1,
        code: -1,
        codeImg: 'http://sdk-test.changic.net.cn:8191/image/card/-3',
        showMethod: 4,
        showProductList: 0,
        isOfficial: 0,
        nodes: [
          {
            name: 'Anpay',
            description: '',
            channel: 33,
            code: 109,
            codeImg: 'http://sdk-test.changic.net.cn:8191/image/card/109.png',
            showMethod: 1,
            showProductList: 1,
            exInfo: 'vietnamANPAY',
            isOfficial: 0,
            selectedProduct: {
              productName: 'product_pkcentury_card_20',
              productDesc: '一箱钻石',
              discountDesc: '钻石',
              amount: 4.99,
              currency: 'USD',
              shortCurrency: '$',
              gameCoin: 100,
              gameCurrency: 'Diamonds',
              itemType: 0,
            },
            products: [
              {
                productName: 'product_pkcentury_card_20',
                productDesc: '一箱钻石',
                discountDesc: '钻石',
                amount: 4.99,
                currency: 'USD',
                shortCurrency: '$',
                gameCoin: 100,
                gameCurrency: 'Diamonds',
                itemType: 0,
              },
              {
                productName: 'product_anpay_20',
                amount: 20000.0,
                currency: 'VND',
                shortCurrency: '₫',
                gameCoin: 200,
                gameCurrency: 'Xu',
                itemType: 0,
              },
            ],
          },
          {
            name: 'exb',
            description: '',
            channel: 27,
            code: 41,
            codeImg: 'http://sdk-test.changic.net.cn:8191/image/card/41.png',
            showMethod: 0,
            showProductList: 1,
            exInfo: 'ATM_ONLINE,EXB',
            isOfficial: 0,
            products: [
              {
                productName: 'product_gate_10',
                amount: 10000.0,
                currency: 'VND',
                shortCurrency: '₫',
                gameCoin: 100,
                gameCurrency: 'Xu',
                itemType: 0,
              },
            ],
          },
        ],
      },
    ],
  };
  return result;
}
export function getPaymentHistoryRes(options) {
  console.log(JSON.stringify({url: options.url, type: options.type, body: options.body}));
  const result = {
    code: 200,
    error_msg: 'success',
    data: [
      {
        transactionId: 'V4_10062_DS123321',
        amount: '10000',
        currency: 'VND',
        channel: 1,
        status: 200,
        chargingType: 1,
        clientDate: '2',
      },
    ],
  };
  return result;
}
