import React, {useEffect} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {PaymentLocationState, getChannel} from './index';
import {Ins} from '../../index';

let lastTime = 0;
export default function Order({
  location,
  history,
  open
}: RouteComponentProps<any, {}, PaymentLocationState> & {open: (url: string) => void}) {
  const currentTime = Date.now();
  if (currentTime - lastTime < 1500) return null;
  lastTime = currentTime;
  const channel = getChannel(location.state.keys);
  useEffect(() => {
    RG.jssdk
      .order(channel)
      .then(res => {
        if (res.code === 200) {
          if (channel.showMethod === 0 || channel.showMethod === 9) {
            history.replace('/payments/type0', {
              url: res.data.returnInfo.url,
              keys: location.state.keys
            });
          } else if (channel.showMethod === 12 || channel.showMethod === 13) {
            open(res.data.returnInfo.url);
          } else if (channel.showMethod === 3) {
            history.goBack();
          }
        } else {
          Ins.showNotice(res.error_msg);
          console.error(res);
        }
      })
      .catch(e => {
        Ins.showNotice(RG.jssdk.config.i18n.net_error_0);
      });
  });
  return <div className='rg-hide'></div>;
}
