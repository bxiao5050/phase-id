import React, {Fragment} from 'react';
import {Route, MemoryRouter} from 'react-router-dom';
import {createLocation} from 'history';
import Notice from './components/message/notice';
import Confirm from './components/message/confirm';
// import Hover from './components/hover';
// import Account from './components/account';
import Login from './components/login';
// import Payment from './components/payment';
/* 类型 */
import {PaymentConfigRes} from '../api/payment';

import I18n from './language/zh_cn';
window.RG = { jssdk: { config: { i18n: I18n }}} as any;

class App extends React.Component {
  public refs: {
    // notice: Notice;
    // hover: Hover;
    confirm: Confirm;
    notice: Notice;
    loginRoute: Route<Login>;
  };

  constructor(props: any) {
    super(props);
    App._ins = this;
  }

  private static _ins: App;
  static get instance(): App {
    return this._ins;
  }

  state = {
    showAccount: false,
    accountEntry: ['/main'],
    hasAccount: false,
    hoverIsGuest: false,
    showLogin: false,
    showPayment: false,
    paymentConfig: null,

    isShowMark: false
  };
  showPrompt(title: string, content: string, isAlert: boolean = false) {
    this.setState({isShowMark: true});
    return this.refs.confirm.showConfirm(title, content, isAlert);
  }
  hideMark = () => {
    this.setState({isShowMark: false});
  };
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

  render() {
    var defaultModule = ['/main'];
    const {isShowMark, showLogin} = this.state;
    return (
      <Fragment>
        {isShowMark ? <div className='rg-mark'></div> : null}
        {/* 登录模块 */}
        {showLogin ? (
          <MemoryRouter initialEntries={['/login']}>
            <Route
              ref='loginRoute'
              render={({history}) => <Login ref='login' Ins={this} history={history} />}
            />
          </MemoryRouter>
        ) : null}
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
