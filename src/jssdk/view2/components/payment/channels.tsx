import React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';

import {replaceUrlToHttps} from '../../../utils';
import {PaymentLocationState, getPath, getChannel} from './index';

export default function Type4({location}: RouteComponentProps<{}, {}, PaymentLocationState>) {
  const channel = getChannel(location.state.keys);
  return (
    <div className='rg-pay-type4'>
      <h2 className='rg-pay-name'>{channel.name}</h2>
      <div className='rg-cards-wrap'>
        <ul className='rg-cards'>
          {channel.nodes.map((channel, i) => (
            <li key={i}>
              <Link
                className='rg-card'
                to={{pathname: getPath(channel,location), state: {keys: [...location.state.keys, 'nodes', i]}}}
              >
                <img className='rg-card-img' src={replaceUrlToHttps(channel.codeImg)} />
                <p className='rg-card-name'>{channel.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
