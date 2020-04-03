import './Main.scss';

import * as React from 'react';
import {Route} from 'react-router-dom';
import {createLocation} from 'history';
import Login from './index';
import Choose from './Choose';
import {Ins} from 'Src/jssdk/view/index';
// import Account from "../../../Base/Account";

export default class Main extends React.Component<
  {
    Login: Login;
  },
  {},
  any
> {
  constructor(props) {
    super(props);
  }

  public refs: {
    choose: Choose;
  };
  facebookLogin() {
    RG.jssdk.fbLogin(true).then(res => {
      if (res.code === 200) {
        this.props.Login.loginComplete();
      } else {
        Ins.showNotice(RG.jssdk.config.i18n.UnknownErr);
        console.log(res);
      }
    });
  }
  visitorRegister() {
    RG.jssdk.visitorRegister().then(res => {
      if (res.code === 200) {
        this.props.Login.loginComplete();
      } else {
        Ins.showNotice(RG.jssdk.config.i18n.UnknownErr);
        console.log(res);
      }
    });
  }

  state = {
    users: RG.jssdk.account.users
  };

  render() {
    return (
      <div className={'content win-login win-choose'}>
        {/* 文字不能显示 */}
        <h2 className='logo block'>POCKET GAMES</h2>
        <div className='wrapper'>
          <Route
            exact
            path='/main'
            render={() => {
              if (Object.keys(this.state.users).length) {
                return <Choose ref='choose' Login={this.props.Login} />;
              } else {
                return (
                  <a
                    className='btn-guest'
                    onClick={() => {
                      this.visitorRegister();
                    }}
                  >
                    &gt;&gt;&gt; {RG.jssdk.config.i18n.dom008} &lt;&lt;&lt;
                  </a>
                );
              }
            }}
          />

          <a
            className='btn-fb'
            onClick={() => {
              if (RG.jssdk.config.fb_sdk_loaded) {
                Ins.showNotice(RG.jssdk.config.i18n.loading);
                this.facebookLogin.apply(this);
              } else {
                Ins.showNotice(RG.jssdk.config.i18n.loadException);
              }
            }}
          >
            <span className='icon-fb ' />
            <span>&nbsp;{RG.jssdk.config.i18n.dom005} Facebook</span>
          </a>
        </div>
        <div className='line'>
          <div className='line-left'></div>
          <div className='line-right'></div>
        </div>
        <div className='box'>
          <a
            className='btn-login'
            onClick={() => {
              this.props.Login.props.history.push(createLocation('/entry'));
            }}
          >
            <span className='icon-login' />
            <span className='name'>{RG.jssdk.config.i18n.dom005}</span>
          </a>
          <div className='line-bot' />
          <a
            className='btn-register'
            onClick={() => {
              this.props.Login.props.history.push(createLocation('/register'));
            }}
          >
            <span className='icon icon-register' />
            <span className='name'>{RG.jssdk.config.i18n.dom004}</span>
          </a>
        </div>
      </div>
    );
  }
}
