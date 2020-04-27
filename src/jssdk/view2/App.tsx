import React, {Fragment} from 'react';
import {Route, MemoryRouter} from 'react-router-dom';
import Notice from './components/message/notice';
import Confirm from './components/message/confirm';

// import Hover from './components/hover';
// import Account from './components/account';
// import Login from './components/login';
// import Payment from './components/payment';
import {PaymentConfigRes} from '../api/payment';

import I18n from './language/zh_cn';
window.RG = {jssdk: {config: {i18n: I18n}}} as any;

class App extends React.Component {
  public refs: {
    // notice: Notice;
    // hover: Hover;
    loginRoute: any;
    confirm: Confirm;
    notice: Notice;
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

  render() {
    var defaultModule = ['/main'];
    const {isShowMark} = this.state;
    return (
      <Fragment>
        {isShowMark ? <div className='mark'></div> : null}
        {/* 提示模块 notice
        {this.state.noticeList.map((noticeMsg, index) => {
          return <Notice key={index} msg={noticeMsg} Ins={this} />;
        })} */}
        {/* Notice */}
        <Notice ref='notice' hideMark={() => this.hideMark()} />
        {/* confirm */}
        <Confirm ref='confirm' hideMark={() => this.hideMark()} />
        {/* alert */}
      </Fragment>
    );
  }
}

export default App;
