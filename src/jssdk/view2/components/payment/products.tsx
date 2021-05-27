import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {PaymentLocationState, getPath, getChannel} from './index';

export default function Products({
  history,
  location
}: RouteComponentProps<{}, {}, PaymentLocationState>) {
  const channel = getChannel(location.state.keys);
  const i18n = RG.jssdk.config.i18n;
  return (
    <div>
      <h2 className='rg-pay-name'>{channel.name}</h2>
      <div className='rg-typelist-wrap'>
        <ul className='rg-typelist'>
          {channel.products
            ? channel.products.map((product, i) => (
                <li key={i} className='rg-product clearfix'>
                  <div
                    className='rg-product-name'
                    dangerouslySetInnerHTML={{__html: product.productDesc}}
                  ></div>
                  <div className='rg-price-wrap'>
                    <div className='rg-price'>{product.shortCurrency + ' ' + product.amount}</div>
                    <div
                      className='rg-typelist-buy-btn'
                      onClick={() => {
                        channel.selectedProduct = product;
                        let path = getPath(channel, location, false);
                        history.push(path, {keys: location.state.keys});
                      }}
                    >
                      {i18n.cg_txt_consume_buy}
                    </div>
                  </div>
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
}
