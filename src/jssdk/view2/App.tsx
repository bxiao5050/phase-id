import React, {Fragment} from 'react';
import {Route, MemoryRouter} from 'react-router-dom';

import Hover from './components/hover';
import Login from './components/login';
import Account from './components/account';
// import Customer from './components/customer';
import Notice from './components/message/notice';
import Confirm from './components/message/confirm';
import BindTip from './components/account/bindTip';
import Payment from './components/payment';

/* 类型 */
import {PaymentConfigRes} from '../api/payment';

type IState = {
  hasAccount: boolean;
  hoverIsGuest: boolean;
  showPayment: boolean;
  paymentConfig: PaymentConfigRes;

  showLogin: boolean;
  // showCustomer: boolean;
  isShowMark: boolean;
  showAccount: boolean;
  // accountEntry: string[];
  // paymentsEntry: string[];
};

class App extends React.Component {
  confirm: Confirm = null;
  notice: Notice = null;
  login: Login = null;
  bindTip: BindTip = null;
  hover: Hover = null;
  setConfirmRef = (e: Confirm) => {
    this.confirm = e;
  };
  setNoticeRef = (e: Notice) => {
    this.notice = e;
  };
  setLoginRouteRef = (e: Login) => {
    this.login = e;
  };
  setBindTipRef = (e: BindTip) => {
    this.bindTip = e;
  };
  setHoverTipRef = (e: Hover) => {
    this.hover = e;
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
    hasAccount: false,
    hoverIsGuest: false,
    showPayment: false,
    paymentConfig: null,

    showLogin: false,
    // showCustomer: false,
    isShowMark: false,
    showAccount: false
    // accountEntry: ['/main'],
    // paymentsEntry: ['/main']
  } as IState;
  showPrompt(title: string, content: string, isAlert: boolean = false) {
    return this.confirm.showConfirm(title, content, isAlert);
  }
  showNotice = (msg: string) => {
    this.notice.addMsg(msg);
  };
  showPayment = (paymentConfig: PaymentConfigRes) => {
    this.setState({
      showPayment: true,
      paymentConfig: paymentConfig,
      isShowMark: true
    });
  };

  hidePayment = () => {
    this.setState({
      showPayment: false,
      isShowMark: false
    });
  };
  showLogin = () => {
    this.setState({
      showLogin: true,
      isShowMark: true
    });
    return this.login;
  };
  hideLogin = () => {
    this.setState({
      showLogin: false,
      isShowMark: false
    });
  };
  showHover = (isGuest: boolean) => {
    this.setState({
      hasAccount: true,
      hoverIsGuest: isGuest
    });
  };
  // toggleCustomer(isShowCustomer: boolean) {
  //   this.setState({
  //     showCustomer: isShowCustomer,
  //     isShowMark: isShowCustomer
  //   });
  // }
  toggleAccount(isShowAccount: boolean) {
    this.setState({
      showAccount: isShowAccount,
      isShowMark: isShowAccount
    });
  }
  copy(message: string, successTxt: string) {
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', message);
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, 9999);
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      this.showNotice(successTxt);
    } else {
      this.showPrompt(RG.jssdk.config.i18n.txt_copy, message, true);
    }
    document.body.removeChild(input);
  }
  copyUserInfo() {
    const user = RG.jssdk.account.user;
    const i18n = RG.jssdk.config.i18n;
    const tips = {
      2: RG.jssdk.config.i18n.copyFbTxt,
      11: RG.jssdk.config.i18n.copyKakaoTxt
    };
    if (tips[user.accountType]) {
      this.showNotice(tips[user.accountType]);
      return;
    }
    const message = `${i18n.txt_account_name}${user.userName}  ${i18n.password}${user._up}`;
    this.copy(message, i18n.copySuccessTxt);
  }
  showRegisterSuccess() {
    this.bindTip.showConfirm(
      RG.jssdk.config.i18n.registerVisitorSuccessTxt,
      RG.jssdk.config.i18n.bindSuccessMsgTxt,
      true,
      true
    );
  }
  showBindTip() {
    this.bindTip.showConfirm('', RG.jssdk.config.i18n.bindVisitorTxt, true).then(res => {
      if (res) {
        // 跳转到游客升级的页面
        this.setState({
          showAccount: true,
          isShowMark: true
        });
      }
    });
  }
  showBindSuccess() {
    const i18n = RG.jssdk.config.i18n;
    this.bindTip.showConfirm(i18n.bindSuccessTitleTxt, i18n.bindSuccessMsgTxt, false);
  }
  autoShowBindTip() {
    // 是否需要弹窗，升级后改为 false
    if (!RG.jssdk.config.popUpSwitch) return;
    // 弹窗是否关闭,没有关闭就等下次到时间后判断
    if (!this.bindTip.state.isShow) this.showBindTip();
    setTimeout(() => {
      this.autoShowBindTip();
    }, RG.jssdk.config.popUpInterval * 1000);
  }
  render() {
    const {isShowMark, showLogin, showAccount, showPayment} = this.state;
    const defaultAccount = ['/main'];
    return (
      <Fragment>
        {isShowMark ? <div className='rg-mark'></div> : null}
        {/* 登录模块 */}
        {showLogin && (
          <MemoryRouter initialEntries={['/main']}>
            <Route
              render={({history}) => <Login ref={this.setLoginRouteRef} history={history} />}
            />
          </MemoryRouter>
        )}
        {/* 用户中心 */}
        {showAccount && (
          <MemoryRouter initialEntries={defaultAccount}>
            <Route render={({history}) => <Account history={history} />} />
          </MemoryRouter>
        )}
        {/* 支付模块 */}
        {showPayment && (
          <MemoryRouter initialEntries={['/payments']}>
            <Route component={Payment} />
          </MemoryRouter>
        )}
        {/* 悬浮球 */}
        {this.state.hasAccount && (
          <Hover ref={this.setHoverTipRef} isGuest={this.state.hoverIsGuest} />
        )}
        {/* 客服中心,改为直接跳转facebook主页 */}
        {/* {showCustomer ? <Customer hideCustomer={this.toggleCustomer} /> : null} */}
        {/* Notice */}
        <Notice ref={this.setNoticeRef} />
        {/* confirm alert */}
        <Confirm ref={this.setConfirmRef} />
        {/* 绑定游客的弹窗和成功的弹窗 */}
        <BindTip ref={this.setBindTipRef} />
      </Fragment>
    );
  }
}

export default App;
