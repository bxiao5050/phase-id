import * as React from 'react';
import Payment from './index';
import {createLocation} from 'history';

type paymentProps = {
  Payment: Payment;
};

export default class TypeList extends React.Component<paymentProps, {}, any> {
  private index = 'typelist';

  render() {
    var source = this.props.Payment.state.paymentDatas[this.index];
    const i18n = RG.jssdk.config.i18n;
    return (
      <div>
        <h2 className='rg-pay-name'>{source.name}</h2>
        <div className='rg-typelist-wrap'>
          <ul className='rg-typelist'>
            {source.products.map((product, i) => (
              <li key={i} data-id={i} className="rg-product">
                <div className='rg-product-name' dangerouslySetInnerHTML={{__html: product.productDesc}}>
                  {/* <div className="up">
                  {product.gameCurrency} *{product.gameCoin}
                </div>
                <div className="down">
                </div> */}
                  {/* {product.productDesc} */}
                </div>
                <div className='rg-price-wrap'>
                  <div className='rg-price'>
                    {product.shortCurrency + ' ' + product.amount}
                  </div>
                  <div
                    className='rg-typelist-buy-btn'
                    onClick={() => {
                      // console.log('typeList', product, source)
                      // RG.jssdk
                      //   .order(
                      //     Object.assign(source, {
                      //       channel: source.channel,
                      //       code: source.code,
                      //       isOfficial: source.isOfficial,
                      //       exInfo: source.exInfo,
                      //       selectedProduct: {
                      //         amount: product.amount,
                      //         currency: product.currency,
                      //         productName: product.productName,
                      //         itemType: product.itemType
                      //       }
                      //     })
                      //   )
                      //   .then(orderRes => {
                      //     // this.props.Payment.orderCompleted(orderRes, source);
                      //   });
                    }}
                  >
                    {i18n.cg_txt_consume_buy}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
