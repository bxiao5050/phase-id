import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {PaymentLocationState, getChannel} from './index';
import {replaceUrlToHttps} from '../../../utils';

export default function Products({
  history,
  location
}: RouteComponentProps<{}, {}, PaymentLocationState>) {
  const channel = getChannel(location.state.keys);
  const i18n = RG.jssdk.config.i18n;
  const pay = () => {
    if (channel.showMethod === 9 || channel.showMethod === 13 || channel.showMethod === 3) {
      history.push(location.pathname + '/order', {keys: location.state.keys});
    } else if (channel.showMethod === 10) {
      history.push('/payments/type1', {keys: location.state.keys});
    } else if (channel.showMethod === 11) {
      history.push('/payments/type2', {keys: location.state.keys});
    }
    else {
      console.error(channel);
    }
  };
  return (
    <div>
      <h2 className='rg-pay-name'>{channel.name}</h2>
      <div className='rg-pay-type3-content'>
        <div className='rg-type3-top'>
          <div className='rg-type3-img-wrap'>
            <img className='rg-type3-img' src={replaceUrlToHttps(channel.codeImg)} />
          </div>
          <div
            className='rg-type3-desc'
            dangerouslySetInnerHTML={{__html: channel.selectedProduct.productDesc}}
          ></div>
        </div>
        <div className='rg-type3-center'>
          <div className='rg-type3-price'>
            {' '}
            {channel.selectedProduct.shortCurrency + ' ' + channel.selectedProduct.amount}
          </div>
          <div className='rg-type3-buy-btn' onClick={pay}>
            {i18n.cg_txt_consume_buy}
          </div>
        </div>
      </div>

      <div className='rg-type3-down'>{channel.description || i18n.txt_pay_defualt_tips}</div>
    </div>
  );
}
