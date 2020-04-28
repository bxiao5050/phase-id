// import './Entry.scss';
import * as React from 'react';
import {createLocation} from 'history';
import Login from './index';

export default class LoginBox extends React.Component<{}, {}> {
  login(userName: string, password: string) {
    // if (!userName || !password) {
    //   return;
    // }
    // const i18n = RG.jssdk.config.i18n;
    // RG.jssdk
    //   .platformLogin(password, userName)
    //   .then(res => {
    //     if (res.code === 200) {
    //       // this.props.Login.loginComplete();
    //     } else if (res.code === 102) {
    //       Ins.showNotice(i18n.code102);
    //     } else if (res.code === 101) {
    //       Ins.showNotice(i18n.code101);
    //     } else {
    //       Ins.showNotice(res.error_msg);
    //     }
    //   })
    //   .catch(err => {
    //     Ins.showNotice(i18n.UnknownErr);
    //     console.log(err);
    //   });
  }
  render() {
    const i18n = RG.jssdk.config.i18n;
    return (
      <div className='rg-login-main rg-center-a'>
        <div className='rg-login-header'>
          <div className='rg-login'></div>
        </div>
        <div className='wrapper'>
          {/* <Choose ref='choose' Login={this.props.Login} /> */}
          <div
            className='btn-login'
            onClick={() => {
              // var {userName, password} = this.refs.choose.state;
              // this.login(userName, password);
            }}
          >
            {i18n.txt_login_game}
          </div>
          <div className='box-link'>
            <a
              onClick={() => {
                // this.props.Login.props.history.goBack();
              }}
              className='link-change'
            >
              {i18n.txt_change_login}
            </a>
            <a
              onClick={() => {
                // this.props.Login.props.history.push(createLocation('/register'));
              }}
              className='link-register'
            >
              {i18n.txt_register_formal}
            </a>
          </div>
        </div>
      </div>
    );
  }
}
