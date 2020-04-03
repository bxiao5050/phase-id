import './index.scss';
import * as React from 'react';
import {Switch, Route} from 'react-router-dom';
import {History, createLocation} from 'history';
import {Ins} from 'Src/jssdk/view/index';
import TypeList from './TypeList';
import Type0 from './Type0';
import Type1 from './Type1';
import Type2 from './Type2';
import Type3 from './Type3';
import Type4 from './Type4';
import Type5 from './Type5';
import WinOpen from './WinOpen';
import {replaceUrlToHttps} from 'Src/jssdk/utils';
import {PaymentChannel, CreateOrderRes} from 'Src/jssdk/api/payment';

type PaymentProps = {
  history: History;
};

export default class Payment extends React.Component<PaymentProps, {}, any> {
  constructor(props) {
    super(props);
  }

  state = {
    isActive: 0,
    paymentDatas: {},
    url: '',
    winOpen: false
  };

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
    return (
      <div className='payment'>
        <div className='payments'>
          <div className='wrap'></div>
          <div className='wrap-payment'>
            <div className='pay-header'>
              <a
                className='back'
                style={{
                  visibility:
                    this.props.history.location.pathname === '/main' ? 'hidden' : 'visible'
                }}
                onClick={() => {
                  this.props.history.goBack();
                }}
              ></a>
              <h2>{RG.jssdk.config.i18n.PayCenter}</h2>
              <a onClick={Ins.hidePayment} className='close'></a>
            </div>

            <div
              className={(() => {
                var className = 'payment-content';
                switch (this.props.history.location.pathname) {
                  case '/type0':
                    className += ' type0';
                    break;
                }
                return className;
              })()}
            >
              <Switch>
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
                {/* 现在只使用了0-5,9-11 */}
                <Route exact path='/type5' render={() => <Type5 Payment={this} />} />
                <Route
                  path='/main'
                  render={() => (
                    <ul className='payment-nav'>
                      {Ins.state.paymentConfig.payments.map((node, index) => {
                        return (
                          <li
                            key={index}
                            data-id={index}
                            className={
                              this.state.isActive == index ? 'pay-main-li active' : 'pay-main-li'
                            }
                            onClick={e => this.change(e)}
                          >
                            <p className='pay-channel-name'>{node.name}</p>
                            {node.discountImg && (
                              <div className='pay-channel-discount'>
                                <img
                                  className='pay-channel-discount-img'
                                  src={node.discountImg
                                    .replace(/http\:\/{0,2}/, 'https://')
                                    .replace(/:[0-9]+/, '')}
                                  alt=''
                                />
                              </div>
                            )}

                            <span className='pay-main-icon'></span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                />
              </Switch>
            </div>
            {this.state.winOpen && <WinOpen parent={this} />}
          </div>
        </div>
      </div>
    );
  }
}
