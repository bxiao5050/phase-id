import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {replaceUrlToHttps} from '../../../utils';

import {PaymentChannel} from '../../../api/payment';
import {PaymentLocationState, getPath} from './index';

export default function ChannelsNav(
  props: RouteComponentProps<{}, {}, PaymentLocationState> & {channels: PaymentChannel[]}
) {
  const {channels, location, history} = props;
  const i = location?.state?.keys[0];
  return (
    <div className='rg-payments-left'>
      <ul className='rg-payments-infos'>
        {channels.map((channel, index) => {
          return (
            <li
              key={index}
              className={i === index ? 'rg-payments-li rg-payments-active' : 'rg-payments-li'}
              onClick={() => history.replace(getPath(channel,location), {keys: [index]})}
            >
              <p className='rg-pay-channel-name'>{channel.name}</p>
              {channel.discountImg && (
                <div className='rg-pay-channel-discount'>
                  <img
                    className='rg-pay-channel-discount-img'
                    src={replaceUrlToHttps(channel.discountImg)}
                    alt='discount'
                  />
                </div>
              )}
              {channel.hotImg && (
                <img
                  className='rg-pay-channel-hot-img'
                  src={replaceUrlToHttps(channel.hotImg)}
                  alt='recommend'
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
