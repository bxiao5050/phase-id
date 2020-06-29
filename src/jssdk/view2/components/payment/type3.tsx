import * as React from 'react';
import Payment from './index';
import {replaceUrlToHttps} from 'Src/jssdk/utils';

/* 导入类型 */
import {PaymentChannel} from 'Src/jssdk/api/payment';

type paymentProps = {
  Payment: Payment;
};

export default class Type3 extends React.Component<paymentProps, {}, any> {
  private index = 3;

  pay(payments: PaymentChannel) {
    // 3, 9, 10, 11, 13
    if (payments.showMethod === 3 || payments.showMethod === 9 || payments.showMethod === 13) {
      this.props.Payment.order(payments);
    } else if (payments.showMethod === 10 || payments.showMethod === 11) {
      this.props.Payment.goMethod(payments);
    } else {
      console.error(payments);
    }
  }
  render() {
    var source = this.props.Payment.state.paymentDatas[this.index];
    const i18n = RG.jssdk.config.i18n;
    // source
    // debugger
    return (
      <div>
        <h2 className='rg-pay-name'>{source.name}</h2>
        <div className='rg-pay-type3-content'>
          <div className='rg-type3-top'>
            <div className='rg-type3-img-wrap'>
              <img className='rg-type3-img' src={replaceUrlToHttps(source.codeImg)} />
            </div>
            <div
              className='rg-type3-desc'
              dangerouslySetInnerHTML={{__html: source.selectedProduct.productDesc}}
            ></div>
          </div>
          <div className='rg-type3-center'>
            <div className='rg-type3-price'>
              {' '}
              {source.selectedProduct.shortCurrency + ' ' + source.selectedProduct.amount}
            </div>
            <div
              className='rg-type3-buy-btn'
              onClick={() => {
                this.pay(source);
              }}
            >
              {i18n.cg_txt_consume_buy}
            </div>
          </div>
        </div>

        <div className='rg-type3-down'>{source.description || i18n.txt_pay_defualt_tips}</div>
      </div>
    );
  }
}
