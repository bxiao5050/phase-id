import * as React from 'react';
import Payment from './index';
import {History} from 'history';
import {replaceUrlToHttps} from 'Src/jssdk/utils';

type paymentProps = {
  Payment: Payment;
  history?: History;
};

export default class Type0 extends React.Component<paymentProps, {}, any> {
  index = 0;
  render() {
    let url: string = "";
    if (this.props.Payment.state.paymentDatas[this.index].returnInfo && this.props.Payment.state.paymentDatas[this.index].returnInfo.url) {
       url = replaceUrlToHttps(this.props.Payment.state.paymentDatas[this.index].returnInfo.url);
    }
    
    return (
      <div className='rg-type0'>
        <iframe className='rg-web' src={url}></iframe>
      </div>
    );
  }
}
