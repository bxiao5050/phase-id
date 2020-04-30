import React, {Fragment} from 'react';
import {Route, MemoryRouter} from 'react-router-dom';

// import Hover from './components/hover';

import Login from './components/login';
import Account from './components/account';
import Customer from './components/customer';
import Notice from './components/message/notice';
import Confirm from './components/message/confirm';
// import Payment from './components/payment';
/* 类型 */
import {PaymentConfigRes} from '../api/payment';

import I18n from './language/th';
window.RG = {jssdk: {config: {i18n: I18n}}} as any;

class App extends React.Component {
  public refs: {
    // notice: Notice;
    // hover: Hover;
    confirm: Confirm;
    notice: Notice;
    loginRoute: Route<Login>;
  };
  i18n = window.RG.jssdk.config.i18n;

  constructor(props: any) {
    super(props);
    App._ins = this;
  }

  private static _ins: App;
  static get instance(): App {
    return this._ins;
  }

  state = {
    hoverIsGuest: false,
    showPayment: false,
    paymentConfig: null,

    showLogin: false,
    showCustomer: false,
    isShowMark: false,
    showAccount: false,
    accountEntry: ['/main']
  };
  showPrompt(title: string, content: string, isAlert: boolean = false) {
    this.setState({isShowMark: true});
    return this.refs.confirm.showConfirm(title, content, isAlert);
  }
  showNotice = (msg: string) => {
    this.refs.notice.addMsg(msg);
  };
  hidePayment = () => {
    this.setState({
      showPayment: false
    });
  };
  showLogin = () => {
    this.setState({
      showLogin: true,
      isShowMark: true
    });
    return this.refs.loginRoute.refs.login as Login;
  };
  hideLogin = () => {
    this.setState({
      showLogin: false,
      isShowMark: false
    });
  };
  toggleCustomer(isShowCustomer: boolean) {
    this.setState({
      showCustomer: isShowCustomer,
      isShowMark: isShowCustomer
    });
  }
  toggleAccount(isShowAccount: boolean) {
    this.setState({
      showAccount: isShowAccount,
      isShowMark: isShowAccount
    });
  }
  render() {
    const {isShowMark, showLogin, showAccount, showCustomer} = this.state;
    const defaultAccount = true ? ['/history'] : ['/vistor'];
    return (
      <Fragment>
        {isShowMark ? <div className='rg-mark'></div> : null}
        {/* 登录模块 */}
        {showLogin ? (
          <MemoryRouter initialEntries={['/main']}>
            <Route
              ref='loginRoute'
              render={({history}) => <Login ref='login' history={history} />}
            />
          </MemoryRouter>
        ) : null}
        {/* 用户中心 */}
        {showAccount ? (
          <MemoryRouter initialEntries={defaultAccount}>
            <Route render={() => <Account />} />
          </MemoryRouter>
        ) : null}
        {/* 客服中心 */}
        {showCustomer ? <Customer hideCustomer={this.toggleCustomer} /> : null}
        {/* Notice */}
        <Notice ref='notice' />
        {/* confirm */}
        <Confirm ref='confirm' />
        {/* alert */}
      </Fragment>
    );
  }
}

export default App;
