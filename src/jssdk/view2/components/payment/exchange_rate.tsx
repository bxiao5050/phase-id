import React from 'react';
import {PaymentChannel} from '../../../api/payment';

export default function ExchangeRate({
  channel,
  close
}: {
  channel: PaymentChannel;
  close: () => void;
}) {
  const i18n = RG.jssdk.config.i18n;
  return (
    <React.Fragment>
      <div className='rg-exchange-wrap' />

      <div className='rg-exchange-rate-list '>
        <h2 className='rg-exchange-name'>
          {i18n.txt_exchange_rate}
          <a className='rg-type2-lose' onClick={close} />
        </h2>
        <ul className='rg-exchange-list'>
          {channel.products
            ? channel.products.map((product, i) => (
                <li className='rg-type2-exchange' key={i} data-id={i}>
                  <div className='rg-item-price'>{product.amount + ' ' + product.currency}</div> =
                  <div className='rg-item-goods'>
                    {product.gameCoin + ' ' + product.gameCurrency}
                  </div>
                </li>
              ))
            : null}
        </ul>
      </div>
    </React.Fragment>
  );
}
