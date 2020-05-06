import * as React from 'react';
import Payment from './index';
import {History, createLocation} from 'history';
import {replaceUrlToHttps} from 'Src/jssdk/utils';
import i18n from 'Src/add-shortcut/i18n';

type paymentProps = {
  Payment: Payment;
};

export default class Type3 extends React.Component<paymentProps, {}, any> {
  private index = 3;

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
                // if (source.showMethod === 10 || source.showMethod === 11) {
                //   let pageName: string;
                //   if (source.showMethod === 10) {
                //     pageName = 'type1';
                //     this.props.Payment.state.paymentDatas[1] = source;
                //   }
                //   if (source.showMethod === 11) {
                //     pageName = 'type2';
                //     this.props.Payment.state.paymentDatas[2] = source;
                //   }

                //   this.props.Payment.props.history.push(createLocation(pageName));
                // }
                // else {
                //   RG.jssdk.order(source).then(OrderRes => {
                //     if (OrderRes.code === 200) {
                //       if (source.showMethod === 9) {
                //         this.props.Payment.orderCompleted(OrderRes, source);
                //       }
                //     } else {
                //       console.error(OrderRes.error_msg);
                //     }
                //   });
                // }
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
