import React, {useState, useEffect} from 'react';
import ReactMedia from 'react-media';
import {Switch, Route, Redirect, RouteComponentProps} from 'react-router-dom';

import ChannelsNav from './channels_nav';
import Products from './products';
import Channels from './channels';
import Type0 from './type0';
import Type1 from './type1';
import Type2 from './type2';
import Type3 from './type3';
import JumpPop from './jump_pop';
import Order from './order';
import {Ins} from '../../index';
import {PaymentChannel} from '../../../api/payment';

export interface PaymentLocationState {
  keys: (number | string)[];
  url?: string;
}
export function getChannel(keys: (number | string)[]) {
  let result: PaymentChannel;
  keys.forEach(key => {
    result = result ? result[key] : Ins.state.paymentConfig.payments[key];
  });
  return result;
}

export function getPath(
  channel: PaymentChannel,
  location: RouteComponentProps<{}, {}, PaymentLocationState>['location'],
  isShowProductList = true
) {
  if (channel.showMethod === 4) {
    return '/payments/channels';
  }
  if (channel.showProductList === 1 && isShowProductList) {
    return '/payments/products';
  }
  if (channel.showMethod === 0 || channel.showMethod === 12) {
    return location.pathname + '/order';
  }
  if ([3, 9, 10, 11, 13].indexOf(channel.showMethod) !== -1) {
    return '/payments/type3';
  }
  if (channel.showMethod === 1 || channel.showMethod === 2) {
    return '/payments/type' + channel.showMethod;
  }
}
const ScreenPortrait = 'screen and (orientation: portrait)';

export default function Payment(props: RouteComponentProps<{}, {}, PaymentLocationState>) {
  const [url, setUrl] = useState('');
  const i18n = RG.jssdk.config.i18n;
  const {history, location} = props;
  const goBack = () => {
    if (location.pathname.indexOf('order') !== -1) return;
    if ((history as any).index === 0) return;
    history.goBack();
  };
  const jumpBrowser = (url: string) => {
    history.goBack();
    setUrl(url);
  };
  const hideJumpPop = () => {
    setUrl('');
  };
  const payments = Ins.state.paymentConfig.payments;
  return (
    <div className='rg-payments rg-center-a'>
      <div className='rg-payments-header'>
        <span className='rg-icon-back' onClick={goBack}></span>
        {i18n.txt_title_pay}
        <span
          className='rg-icon-close'
          onClick={() => {
            Ins.hidePayment();
          }}
        ></span>
      </div>
      <div className='rg-payments-content clearfix'>
        <ReactMedia
          query={ScreenPortrait}
          onChange={matches =>
            matches
              ? props.history.replace('/payments')
              : props.history.replace(getPath(payments[0], location), {keys: [0]})
          }
        >
          {screenIsPortrait =>
            // 竖屏
            screenIsPortrait ? (
              <React.Fragment>
                <Switch>
                  <Route path='/payments/channels' component={Channels} />
                  <Route path='/payments/products' component={Products} />
                  <Route path='/payments/type0' component={Type0} />
                  <Route path='/payments/type1' component={Type1} />
                  <Route path='/payments/type2' component={Type2} />
                  <Route path='/payments/type3' component={Type3} />
                  <Route
                    path='/payments'
                    render={(props: RouteComponentProps<{}, {}, PaymentLocationState>) => (
                      <ChannelsNav {...props} channels={payments} />
                    )}
                  />
                </Switch>
                <Route
                  path={'/payments/:type/order'}
                  render={(
                    props: RouteComponentProps<{type: string}, {}, PaymentLocationState>
                  ) => <Order {...props} open={jumpBrowser} />}
                />
              </React.Fragment>
            ) : (
              // 横屏
              <React.Fragment>
                <Route
                  path='/'
                  render={(props: RouteComponentProps<{}, {}, PaymentLocationState>) => (
                    <ChannelsNav {...props} channels={payments} />
                  )}
                />
                <div className='rg-payments-right'>
                  <Switch>
                    <Route path='/payments/channels' component={Channels} />
                    <Route path='/payments/products' component={Products} />
                    <Route path='/payments/type0' component={Type0} />
                    <Route path='/payments/type1' component={Type1} />
                    <Route path='/payments/type2' component={Type2} />
                    <Route path='/payments/type3' component={Type3} />
                    <Redirect
                      from='/payments'
                      exact={true}
                      to={{pathname: getPath(payments[0], location), state: {keys: [0]}}}
                    />
                  </Switch>
                </div>
                <Route
                  path={'/payments/:type/order'}
                  render={(
                    props: RouteComponentProps<{type: string}, {}, PaymentLocationState>
                  ) => <Order {...props} open={jumpBrowser} />}
                />
              </React.Fragment>
            )
          }
        </ReactMedia>
      </div>
      {url && <JumpPop url={url} close={hideJumpPop} />}
    </div>
  );
}
