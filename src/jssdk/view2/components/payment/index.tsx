import * as React from 'react';
import {Switch, Route} from 'react-router-dom';
import {Ins} from '../../index';
import {replaceUrlToHttps} from '../../..//utils';
import WinOpen from './winOpen';
import Type0 from './type0';
import Type1 from './type1';
import Type2 from './type2';
import Type3 from './type3';
import Type4 from './type4';
import TypeList from './typelist';

import {History, createLocation} from 'history';
import {PaymentChannel, CreateOrderRes} from 'Src/jssdk/api/payment';

export default class Payment extends React.Component<{history: History}, any> {
  state = {
    isActive: 0,
    paymentDatas: {},
    url: '',
    winOpen: false,
    isLandscape:true
  };
  componentDidMount() {
    // "portrait", "landscape";
    const isLandscape =
      window
        .getComputedStyle(document.getElementById('flag-screen'))
        .fontFamily.indexOf('landscape') !== -1;
    if (isLandscape) {
      this.intoPay(Ins.state.paymentConfig.payments[0]);
      this.setState({ isActive: 0, isLandscape: true });
    } else {
      this.setState({ isLandscape: false });
    }
  }
  private isPay = false;
  order(payments: PaymentChannel) {
    if (this.isPay) return;
    this.isPay = true;
    setTimeout(() => {
      this.isPay = false;
    }, 1500);
    // 需要先下单的支付方式有 0,3,9,12,13
    RG.jssdk
      .order(payments)
      .then(res => {
        if (res.code === 200) {
          // showMethod === 3 在下单时在order函数中处理
          if (payments.showMethod === 0 || payments.showMethod === 9) {
            this.state.paymentDatas[0] = res.data;
            this.props.history.push(createLocation('/type0'));
          } else if (payments.showMethod === 12 || payments.showMethod === 13) {
            // this.state.url = replaceUrlToHttps(res.data.returnInfo.url);
            this.state.url = res.data.returnInfo.url;
            this.state.winOpen = true;
            this.setState(this.state);
          } else {
            console.error(payments, res);
          }
        } else {
          Ins.showNotice(res.error_msg);
          console.error(res);
        }
      })
      .catch(e => {
        Ins.showNotice(RG.jssdk.config.i18n.net_error_0);
      });
  }
  goMethod(payments: PaymentChannel) {
    if (payments.showMethod === 10) {
      this.state.paymentDatas[1] = payments;
      this.props.history.push(createLocation('/type1'));
    } else if (payments.showMethod === 11) {
      this.state.paymentDatas[2] = payments;
      this.props.history.push(createLocation('/type2'));
    }
  }
  change = e => {
    var index = e.currentTarget.dataset.id;
    this.setState({
      isActive: index
    });
    this.intoPay(Ins.state.paymentConfig.payments[index]);
  };

  intoPay = (payments: PaymentChannel, isSelectProduct: boolean = false) => {
    // 先判断 showProductList === 1 如果是展示商品列表,
    // isSelectProduct 表示用户是否已经选择商品, 以便于展示对应的展示界面
    if (payments.showProductList === 1 && !isSelectProduct) {
      // 存在商品列表
      this.state.paymentDatas['typelist'] = payments;
      this.props.history.push(createLocation('typeList'));
      return;
    }
    // showMethod 0 直接下单
    if ([0, 12].indexOf(payments.showMethod) !== -1) {
      this.order(payments);
      return;
    }
    let path: string;
    // 先展示支付确认界面,再去对应的支付界面
    if ([3, 9, 10, 11, 13].indexOf(payments.showMethod) !== -1) {
      path = 'type3';
      this.state.paymentDatas[3] = payments;
    } else {
      // 直接去对应的支付确认界面
      path = 'type' + payments.showMethod;
      this.state.paymentDatas[payments.showMethod] = payments;
    }
    // 跳转去对应的支付界面
    this.props.history.push(createLocation(path));
  };
  render() {
    const i18n = RG.jssdk.config.i18n;
    const isMain = this.props.history.location.pathname === "/";
    const isLandscape = this.state.isLandscape;
    const isShowRight = (!isLandscape && !isMain) || isLandscape;
    // console.log(this.props.history)
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
              Ins.hidePayment();
            }}
          ></span>
        </div>
        <div className='rg-payments-content clearfix'>
          <div className={isShowRight ? "rg-payments-left rg-hide": "rg-payments-left"}>
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
                    {node.hotImg && (
                      <img
                        className='rg-pay-channel-hot-img'
                        src={replaceUrlToHttps(node.hotImg)}
                        alt='recommend'
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={isShowRight ? "rg-payments-right": "rg-payments-right rg-hide"}>
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
              <Route exact path='/type1' render={() => <Type1 Payment={this} />} />
              <Route exact path='/type2' render={() => <Type2 Payment={this} />} />
              <Route exact path='/type3' render={() => <Type3 Payment={this} />} />
              <Route exact path='/type4' render={() => <Type4 Payment={this} />} />
            </Switch>
          </div>
        </div>
        <div id='flag-screen'></div>
        {this.state.winOpen && <WinOpen parent={this} />}
      </div>
    );
  }
}
