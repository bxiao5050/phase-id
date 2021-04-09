import React, {useState, useEffect} from 'react';
import {RouteComponentProps} from 'react-router-dom';
../../index
import {Ins} from '../../index';
import {replaceUrlToHttps} from 'Src/jssdk/utils';
import Input from '../login/Input';
import ExchangeRate from './exchange_rate';
import {PaymentLocationState, getChannel} from './index';
/* 导入类型 */
import {CreateOrderRes} from '../../../api/payment';

export default function Type2({location}: RouteComponentProps<{}, {}, PaymentLocationState>) {
  const channel = getChannel(location.state.keys);
  const i18n = RG.jssdk.config.i18n;
  const [pin, setPin] = useState('');

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
    <div className='rg-type2'>
      <h2 className='rg-pay-name'>
        {channel.name}
        {isHasProduct ? (
          <span className='rg-exchange' onClick={() => setIsShowExchangeRate(true)}>
            {i18n.txt_exchange_rate}
          </span>
        ) : null}
      </h2>

      <img className='rg-card-head' src={replaceUrlToHttps(channel.codeImg)} />
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

export function errorHandle(res: CreateOrderRes) {
  const i18n = RG.jssdk.config.i18n;
  switch (res.code) {
    case 200:
      Ins.showNotice(i18n.net_error_200);
      break;
    case 201:
      Ins.showNotice(i18n.net_error_201);
      break;
    case 202:
      Ins.showNotice(i18n.net_error_202);
      break;
    case 203:
      Ins.showNotice(i18n.net_error_203);
      break;
    case 204:
      Ins.showNotice(i18n.net_error_204);
      break;
    case 205:
      Ins.showNotice(i18n.net_error_205);
      break;
    case 206:
      Ins.showPrompt(i18n.txt_pay_pending, i18n.net_error_206, true).then(() => {
        Ins.hidePayment();
      });
      break;
    case 207:
      Ins.showNotice(i18n.net_error_207);
      break;
    default:
      Ins.showNotice(res.error_msg);
      break;
  }
}
