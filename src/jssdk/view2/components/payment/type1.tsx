import * as React from 'react';
import Payment from './index';
import {Ins} from '../../index';
import {replaceUrlToHttps} from 'Src/jssdk/utils';
import {errorHandle} from './type2';
import Input from '../login/Input';

type paymentProps = {
  Payment: Payment;
};
export default class Type1 extends React.Component<paymentProps, {}, any> {
  setInterval = undefined;
  state = {
    pin: '',
    serial: '',
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

  pay = () => {
    if (this.state.isQuerying) return;
    var source = this.props.Payment.state.paymentDatas[this.index];
    source.exInfo = JSON.stringify({
      serialNo: this.state.serial,
      pin: this.state.pin
    });
    this.state.isQuerying = true;
    this.setState(this.state);
    RG.jssdk.order(source).then(res => {
      errorHandle(res);
      this.state.isQuerying = false;
      this.setState(this.state);
      if (res.code === 200) {
        Ins.hidePayment();
      }
    });
  };

  render() {
    var source = this.props.Payment.state.paymentDatas[this.index];
    var isShowExchangeRate = this.state.isShowExchangeRate;
    const i18n = RG.jssdk.config.i18n;
    return (
      <div className='rg-type1'>
        <h2 className='rg-pay-name'>
          {source.name}
          {source.products && source.products[0] ? (
            <span
              className='rg-exchange'
              onClick={() => {
                this.state.isShowExchangeRate = true;
                this.setState(this.state);
              }}
            >
              {i18n.txt_exchange_rate}
            </span>
          ) : null}
        </h2>

        <img className='rg-card-head' src={replaceUrlToHttps(source.codeImg)} />

        <div className='rg-card-inputs' id='serial'>
          <span className='rg-label'>{i18n.txt_serial} </span>
          <Input
            className='rg-type2-pin'
            type='text'
            value={this.state.serial}
            placeholder={i18n.txt_hint_input_serial}
            onChange={e => {
              this.setState({serial: e.target.value});
            }}
          />
        </div>
        <div className='rg-card-inputs' id='pin'>
          <span className='rg-label'>{i18n.txt_pin}</span>
          <Input
            className='rg-type2-pin'
            type='text'
            value={this.state.pin}
            placeholder={i18n.txt_hint_input_pin}
            onChange={e => {
              this.setState({pin: e.target.value});
            }}
          />
        </div>
        {this.state.isQuerying ? (
          <button className='rg-btn-pay'>
            {i18n.txt_pay} {this.state.isQueryingTxt}
          </button>
        ) : (
          <button className='rg-btn-pay' onClick={this.pay}>
            {i18n.txt_pay}
          </button>
        )}
        {isShowExchangeRate ? <div className='rg-exchange-wrap' /> : null}
        {isShowExchangeRate ? (
          <div className='rg-exchange-rate-list'>
            <h2 className='rg-exchange-name'>
              {i18n.txt_exchange_rate}
              <a
                className='rg-type2-lose'
                onClick={() => {
                  this.state.isShowExchangeRate = false;
                  this.setState(this.state);
                }}
              />
            </h2>

            <ul className='rg-exchange-list'>
              {source.products.map((product, i) => (
                <li className='rg-type2-exchange' key={i} data-id={i}>
                  <div className='rg-item-price'>{product.amount + ' ' + product.currency}</div>=
                  <div className='rg-item-goods'>{product.gameCurrency}</div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }
}
