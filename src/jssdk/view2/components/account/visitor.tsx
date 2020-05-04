import * as React from 'react';
// import {Ins} from 'Src/jssdk/view/index';
import Input from '../login/Input';

import {RouteComponentProps} from 'react-router-dom';

export default class Visitor extends React.Component<RouteComponentProps, {}, any> {
  state = {
    userName: '',
    password1: '',
    password2: '',
    showPass: false,
  };

  register = () => {
    // const i18n = RG.jssdk.config.i18n;
    // const {password1, password2, userName} = this.state;
    // if (!password1 || !password2 || !userName) {
    //   return;
    // }
    // if (password1 != password2) {
    //   Ins.showNotice(i18n.errMsg001);
    // } else if (password1.length < 6 || password1.length > 20) {
    //   Ins.showNotice(i18n.errMsg002);
    // } else {
    //   RG.jssdk
    //     .platformRegister({
    //       password: password1,
    //       userName,
    //       accountType: 1,
    //       thirdPartyId: '',
    //       email: '',
    //       telephone: '',
    //       userChannel: 0,
    //       exInfo: ''
    //     })
    //     .then(res => {
    //       if (res.code === 200) {
    //         this.props.Login.loginComplete();
    //       } else if (res.code === 102) {
    //         Ins.showNotice(i18n.code102);
    //       } else if (res.code === 101) {
    //         Ins.showNotice(i18n.code101);
    //       } else {
    //         Ins.showNotice(res.error_msg);
    //       }
    //     })
    //     .catch(err => {
    //       Ins.showNotice(i18n.UnknownErr);
    //       console.log(err);
    //     });
    // }
  };

  changeType = () => {
    this.setState({
      showPass: !this.state.showPass
    });
  };

  render() {
    const i18n = RG.jssdk.config.i18n;
    const {userName, password1, password2, showPass} = this.state;
    return (
      <div className='rg-login-main rg-center-a rg-account'>
        <div className='rg-login-header'>
        {i18n.float_button_bind_account}
          <span
            className='rg-icon-close'
            onClick={() => {
              this.props.history.push('/main');
            }}
          ></span>
        </div>
        <div className='rg-login-wrap rg-register-wrap'>
          <div>
            <div className='rg-choose'>
              <span className='rg-icon-user'></span>
              <Input
                className='rg-userName'
                type='text'
                value={userName}
                placeholder={i18n.txt_hint_account}
                onChange={e => {
                  this.setState({userName: e.target.value});
                }}
              />
              {userName ? (
                <span
                  className='rg-icon-close'
                  onClick={() => {
                    this.setState({userName: ''});
                  }}
                ></span>
              ) : null}
            </div>
          </div>
          <div className='rg-choose'>
            <span className='rg-icon-password'></span>
            <Input
              className='rg-password1'
              type={showPass ? 'text' : 'password'}
              value={password1}
              placeholder={i18n.txt_input_new_psw}
              onChange={e => {
                this.setState({password1: e.target.value});
              }}
            />
            {password1 ? (
              <span
                className='rg-icon-close'
                onClick={() => {
                  this.setState({password1: ''});
                }}
              ></span>
            ) : null}
          </div>
          <div className='rg-choose rg-hide-border'>
            <span className='rg-icon-password'></span>
            <Input
              className='rg-password2'
              type={showPass ? 'text' : 'password'}
              value={password2}
              placeholder={i18n.txt_input_new_psw_again}
              onChange={e => {
                this.setState({password2: e.target.value});
              }}
            />
            {password2 ? (
              <span
                className='rg-icon-close'
                onClick={() => {
                  this.setState({password2: ''});
                }}
              ></span>
            ) : null}
          </div>
        </div>
        <div className='rg-check' onClick={this.changeType}>
          <div className={'rg-checkbox ' + (this.state.showPass ? 'rg-register-active' : '')}></div>
          <p className='rg-checkbox-txt'>{i18n.txt_show_pwd}</p>
        </div>
        <div className='rg-btn-login' onClick={() => {}}>
          {i18n.cg_txt_confirm_submit}
        </div>
      </div>
    );
  }
}
