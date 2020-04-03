import './Type1.scss';
import * as React from 'react';
import Payment from './index';
import {Ins} from 'Src/jssdk/view/index';
import {replaceUrlToHttps} from 'Src/jssdk/utils';

type paymentProps = {
  Payment: Payment;
};
export default class Type1 extends React.Component<paymentProps, {}, any> {
  setInterval = undefined;
  state = {
    isQuerying: false,
    isQueryingTxt: '.',
    isShowExchangeRate: false
  };

  setState(state) {
    if (state.hasOwnProperty('isQuerying')) {
      if (state.isQuerying === true) {
        if (this.setInterval === undefined) {
          var isQueryingTxt = this.state.isQueryingTxt;
          this.setInterval = setInterval(() => {
            isQueryingTxt += '.';
            if (isQueryingTxt.length === 4) isQueryingTxt = '.';
            super.setState({
              isQueryingTxt: isQueryingTxt
            });
          }, 750);
        }
      } else {
        if (this.setInterval) {
          state.isQueryingTxt = '.';
          clearInterval(this.setInterval);
          this.setInterval = undefined;
        }
      }
    }
    super.setState(state);
  }

  private index = 1;

  public refs: {
    serial: HTMLInputElement;
    pin: HTMLInputElement;
  };

  pay = () => {
    var source = this.props.Payment.state.paymentDatas[this.index];
    source.exInfo = JSON.stringify({
      serialNo: this.refs.serial.value,
      pin: this.refs.pin.value
    });

    RG.jssdk.order(source).then(orderRes => {
      Ins.showNotice(orderRes.error_msg);

      this.state.isQuerying = false;
      this.setState(this.state);

      Ins.hidePayment();
    });
    this.state.isQuerying = true;
    this.setState(this.state);
  };

  render() {
    var source = this.props.Payment.state.paymentDatas[this.index];
    var isShowExchangeRate = this.state.isShowExchangeRate;
    console.log(source);
    return (
      <div className='Type1 payment-nav'>
        <h2 className='name'>
          {source.name}
          {source.products && source.products[0] ? (
            <span
              className='exchange'
              onClick={() => {
                this.state.isShowExchangeRate = true;
                this.setState(this.state);
              }}
            >
              {RG.jssdk.config.i18n.dom011}
            </span>
          ) : null}
        </h2>

        <img className='card-head' src={replaceUrlToHttps(source.codeImg)} />

        <div className='card-inputs Serial' id='serial'>
          <span>{RG.jssdk.config.i18n.dom014} </span>
          <input
            placeholder='Please enter Serial Number'
            ref='serial'
            onBlur={() => {
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            }}
          />
        </div>
        <div className='card-inputs PIN' id='pin'>
          <span>PIN: </span>
          <input
            placeholder='Please enter PIN'
            ref='pin'
            onBlur={() => {
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            }}
          />
        </div>
        {this.state.isQuerying ? (
          <a href='javascript:void(0);' className='btn-pay'>
            {RG.jssdk.config.i18n.dom012} {this.state.isQueryingTxt}
          </a>
        ) : (
          <a href='javascript:void(0);' className='btn-pay' onClick={this.pay}>
            {RG.jssdk.config.i18n.dom012}
          </a>
        )}
        {isShowExchangeRate ? <div className='exchange-wrap' /> : null}
        {isShowExchangeRate ? (
          <div className='exchange-rate-list'>
            <h2 className='exchange-name'>
              {RG.jssdk.config.i18n.dom011}
              <a
                className='close'
                onClick={() => {
                  this.state.isShowExchangeRate = false;
                  this.setState(this.state);
                }}
              />
            </h2>

            <ul className='exchange-list'>
              {source.products.map((product, i) => (
                <li key={i} data-id={i}>
                  <div className='item-price'>{product.amount + ' ' + product.currency}</div>=
                  <div className='item-goods'>{product.gameCoin + ' ' + product.gameCurrency}</div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }
}
