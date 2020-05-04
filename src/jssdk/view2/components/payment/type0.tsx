import * as React from 'react';
import Payment from './index';
import {History} from 'history';
import {replaceUrlToHttps} from 'Src/jssdk/utils';

type paymentProps = {
  Payment: Payment;
  history?: History;
};

export default class Type0 extends React.Component<paymentProps, {}, any> {
  render() {
    const url = replaceUrlToHttps(this.props.Payment.state.paymentDatas[0].returnInfo.url);
    return (
      <div className='rg-type0'>
        <iframe className='rg-web' src={url}></iframe>
      </div>
    );
  }
}
