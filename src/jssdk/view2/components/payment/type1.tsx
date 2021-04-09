import React, {useState, useEffect} from 'react';
import {RouteComponentProps} from 'react-router-dom';

import {Ins} from '../../index';
import Input from '../login/Input';
import {errorHandle} from './type2';
import ExchangeRate from './exchange_rate';
import {replaceUrlToHttps} from '../../../utils';
import {PaymentLocationState, getChannel} from './index';

export default function Type1({location}: RouteComponentProps<{}, {}, PaymentLocationState>) {
  const channel = getChannel(location.state.keys);
  const i18n = RG.jssdk.config.i18n;
  const [pin, setPin] = useState('');
  const [serial, setSerial] = useState('');

  const [queryingTxt, setQueryingTxt] = useState('');
  const [isShowExchangeRate, setIsShowExchangeRate] = useState(false);
  const close = () => setIsShowExchangeRate(false);
  const isHasProduct = !!(channel.products && channel.products[0]);
  const loading = () => {
    function add() {
      if (!queryingTxt) return;
      let str = queryingTxt + '.';
      if (str.length === 4) str = '.';
      setQueryingTxt(str);
      setTimeout(add, 300);
    }
    add();
  };
  const pay = () => {
    if (queryingTxt !== '') return;
    channel.exInfo = JSON.stringify({
      serialNo: '',
      pin
    });
    loading();
    RG.jssdk.order(channel).then(res => {
      errorHandle(res);
      setQueryingTxt('');
      if (res.code === 200) {
        Ins.hidePayment();
      }
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
      {queryingTxt ? (
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
