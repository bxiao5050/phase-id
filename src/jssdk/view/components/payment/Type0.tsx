import './Type0.scss';
import * as React from 'react';
import Payment from 'Src/jssdk/view/components/payment';
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
      <div className='payment-nav Type0'>
        <iframe ref='iframe' className='web' src={url}></iframe>
      </div>
    );
  }
}
