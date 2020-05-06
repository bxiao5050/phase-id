import * as React from 'react';
import {Switch, Route} from 'react-router-dom';
import {Ins} from '../../index';
import {replaceUrlToHttps} from '../../..//utils';
import WinOpen from './winOpen';
import Type0 from './type0';
import Type3 from './type3';
import Type4 from './type4';
import TypeList from './typelist';

import {History, createLocation} from 'history';
import {RouteComponentProps} from 'react-router-dom';
import {PaymentChannel, CreateOrderRes} from 'Src/jssdk/api/payment';

export default class Payment extends React.Component<{history: History}, any> {
  state = {
    isActive: 0,
    paymentDatas: {},
    url: '',
    winOpen: false
  };
  componentDidMount() {
    this.intoPay(Ins.state.paymentConfig.payments[0]);
  }
  orderCompleted(orderRes: CreateOrderRes, payments: PaymentChannel) {
    if (orderRes.code === 200) {
      this.state.paymentDatas[0] = orderRes.data;

      var nn = String.prototype.toLocaleLowerCase.call(payments.name.replace(/\s/g, ''));
      const paymentNames = ['paypal', 'mycard', 'visa'];
      if (paymentNames.indexOf(nn) !== -1) {
        this.state.url = replaceUrlToHttps(orderRes.data.returnInfo.url);
        this.state.winOpen = true;
        this.setState(this.state);
      } else {
        this.props.history.push(
          createLocation('/type0', {
            from: nn
          })
        );
      }
    } else {
      console.error(orderRes.error_msg);
    }
  }

  change = e => {
    var index = e.currentTarget.dataset.id;
    this.setState({
      isActive: index
    });
    this.intoPay(Ins.state.paymentConfig.payments[index]);
  };

  intoPay = (payments: PaymentChannel) => {
    var pageName;

    if (payments.showProductList === 1) {
      // 存在商品列表
      this.state.paymentDatas['typelist'] = payments;
      this.props.history.push(createLocation('typeList'));
    } else {
      if (payments.showMethod === 0) {
        // 直接下单
        RG.jssdk.order(payments).then(orderRes => {
          this.orderCompleted(orderRes, payments);
        });
      } else {
        if (payments.showMethod > 8) {
          pageName = 'type3';
          this.state.paymentDatas[3] = payments;
        } else {
          pageName = 'type' + payments.showMethod;
          this.state.paymentDatas[payments.showMethod] = payments;
        }

        this.props.history.push(createLocation(pageName));
      }
    }
  };
  render() {
    const i18n = RG.jssdk.config.i18n;
    return (
      <div className='rg-payments rg-center-a rg-login-main'>
        <div className='rg-payments-header rg-login-header'>
          <span
            className='rg-icon-back'
            onClick={() => {
              this.props.history.goBack();
            }}
          ></span>
          {i18n.txt_title_pay}
          <span
            className='rg-icon-close'
            onClick={() => {
              this.props.history.goBack();
            }}
          ></span>
        </div>
        <div className='rg-payments-content'>
          <div className='rg-payments-left'>
            <ul className='rg-payments-infos'>
              {Ins.state.paymentConfig.payments.map((node, index) => {
                return (
                  <li
                    key={index}
                    data-id={index}
                    className={
                      this.state.isActive == index
                        ? 'rg-payments-li rg-payments-active'
                        : 'rg-payments-li'
                    }
                    onClick={e => {
                      this.change(e);
                    }}
                  >
                    <p className='rg-pay-channel-name'>{node.name}</p>
                    {node.discountImg && (
                      <div className='rg-pay-channel-discount'>
                        <img
                          className='rg-pay-channel-discount-img'
                          src={replaceUrlToHttps(node.discountImg)}
                          alt='discount'
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className='rg-payments-right'>
            <Switch>
              <Route
                exact
                path='/main'
                render={() => {
                  return <div>{'main'}</div>;
                }}
              />
              <Route exact path='/typeList' render={() => <TypeList Payment={this} />} />
              <Route
                exact
                path='/type0'
                render={({history}) => <Type0 Payment={this} history={history} />}
              />
              {/* <Route exact path='/type1' render={() => <Type1 Payment={this} />} /> */}
              {/* <Route exact path='/type2' render={() => <Type2 Payment={this} />} /> */}
              <Route exact path='/type3' render={() => <Type3 Payment={this} />} />
              <Route exact path='/type4' render={() => <Type4 Payment={this} />} />
              {/* 现在只使用了0-5,9-11 */}
              {/* <Route exact path='/type5' render={() => <Type5 Payment={this} />} /> */}
            </Switch>
          </div>
        </div>
        {this.state.winOpen && <WinOpen parent={this} />}
      </div>
    );
  }
}
