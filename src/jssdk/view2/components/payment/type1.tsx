import React, {useState, useEffect} from 'react';
import {RouteComponentProps} from 'react-router-dom';

import {Ins} from '../../index';
import Input from '../login/Input';
import {errorHandle} from './type2';
import ExchangeRate from './exchange_rate';
import {replaceUrlToHttps} from '../../../utils';
import {PaymentLocationState, getChannel} from './index';
// 过度动画的定时器
let timer = null;

export default function Type1({location}: RouteComponentProps<{}, {}, PaymentLocationState>) {
  const channel = getChannel(location.state.keys);
  const i18n = RG.jssdk.config.i18n;
  const [pin, setPin] = useState('');
  const [serial, setSerial] = useState('');

  const [queryingTxt, setQueryingTxt] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [isShowExchangeRate, setIsShowExchangeRate] = useState(false);
  const close = () => setIsShowExchangeRate(false);
  const isHasProduct = !!(channel.products && channel.products[0]);
  useEffect(() => {
    function add() {
      let str = queryingTxt + '.';
      if (str.length === 4) str = '.';
      timer = setTimeout(() => {
        setQueryingTxt(str);
      }, 300);
    }
    if (isQuerying) {
      add();
    }

    return function cleanup() {
      if (timer) {
        clearTimeout(timer);
      }
    };
  });
  const pay = () => {
    if (pin === '' || serial === '') {
      Ins.showNotice(i18n.net_error_205);
      return;
    }
    if (isQuerying) return;
    channel.exInfo = JSON.stringify({
      serialNo: serial,
      pin
    });
    setIsQuerying(true);
    RG.jssdk
      .order(channel)
      .then(res => {
        errorHandle(res);
        timer = null;
        setIsQuerying(false);
        setQueryingTxt('.');
        if (res.code === 200) {
          Ins.hidePayment();
          setPin('');
          setSerial('');
        }
      })
      .catch(err => {
        timer = null;
        setIsQuerying(false);
        setQueryingTxt('.');
        console.log(err);
        Ins.showNotice(RG.jssdk.config.i18n.net_error_0);
      });
  };
  return (
    <div className='rg-type1'>
      <h2 className='rg-pay-name'>
        {channel.name}
        {isHasProduct ? (
          <span className='rg-exchange' onClick={() => setIsShowExchangeRate(true)}>
            {i18n.txt_exchange_rate}
          </span>
        ) : null}
      </h2>

      <img className='rg-card-head' src={replaceUrlToHttps(channel.codeImg)} />

      <div className='rg-card-inputs' id='serial'>
        <span className='rg-label'>{i18n.txt_serial} </span>
        <Input
          className='rg-type2-pin'
          type='text'
          value={serial}
          placeholder={i18n.txt_hint_input_serial}
          onChange={e => setSerial(e.target.value)}
        />
      </div>
      <div className='rg-card-inputs' id='pin'>
        <span className='rg-label'>{i18n.txt_pin}</span>
        <Input
          className='rg-type2-pin'
          type='text'
          value={pin}
          placeholder={i18n.txt_hint_input_pin}
          onChange={e => setPin(e.target.value)}
        />
      </div>
      {isQuerying ? (
        <button className='rg-btn-pay'>
          {i18n.txt_pay} {queryingTxt}
        </button>
      ) : (
        <button className='rg-btn-pay' onClick={pay}>
          {i18n.txt_pay}
        </button>
      )}
      {isShowExchangeRate ? <ExchangeRate channel={channel} close={close} /> : null}
    </div>
  );
}
