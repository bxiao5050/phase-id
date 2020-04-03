import './TypeList.scss';
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
    return (
      <div className='payment-nav type-list'>
        <h2 className='name'>{source.name}</h2>
        <ul className='type-list'>
          {source.products.map((product, i) => (
            <li key={i} data-id={i}>
              <div className='item-name' dangerouslySetInnerHTML={{__html: product.productDesc}}>
                {/* <div className="up">
                  {product.gameCurrency} *{product.gameCoin}
                </div>
                <div className="down">
                </div> */}
                {/* {product.productDesc} */}
              </div>
              <div className='item-price-btn'>
                <div className='price-item noselect'>
                  {product.shortCurrency + ' ' + product.amount}
                </div>
                <div
                  className='btn-item noselect'
                  onClick={() => {
                    // console.log('typeList', product, source)
                    RG.jssdk
                      .order(
                        Object.assign(source, {
                          channel: source.channel,
                          code: source.code,
                          isOfficial: source.isOfficial,
                          exInfo: source.exInfo,
                          selectedProduct: {
                            amount: product.amount,
                            currency: product.currency,
                            productName: product.productName,
                            itemType: product.itemType
                          }
                        })
                      )
                      .then(orderRes => {
                        this.props.Payment.orderCompleted(orderRes, source);
                      });
                  }}
                >
                  {RG.jssdk.config.i18n.Purchase}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
