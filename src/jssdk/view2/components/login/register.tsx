import * as React from 'react';
import {Ins} from '../../index';
import Input from './Input';
/* 导入类型 */
import {RouteComponentProps} from 'react-router-dom';

export default class Register extends React.Component<RouteComponentProps, {}, any> {
  state = {
    userName: '',
    password1: '',
    password2: '',
    showPass: false
  };

  register = () => {
    const {password1, password2, userName} = this.state;
    const i18n = RG.jssdk.config.i18n;
    if (!userName) {
      Ins.showNotice(i18n.txt_hint_account);
      return;
    }
    if (userName.length < 4 || userName.length > 50) {
      Ins.showNotice(i18n.net_error_004);
      return;
    }
    if (!password1) {
      Ins.showNotice(i18n.txt_hint_password);
      return;
    }
    if (!password2) {
      Ins.showNotice(i18n.txt_input_psw_again);
      return;
    }
    if (password1 != password2) {
      Ins.showNotice(i18n.net_error_006);
      return;
    }
    if (password1.length < 6 || password1.length > 20) {
      Ins.showNotice(i18n.net_error_005);
      return;
    }
    RG.jssdk
      .platformRegister({
        password: password1,
        userName,
        accountType: 1,
        thirdPartyId: '',
        email: '',
        telephone: '',
        userChannel: 0,
        exInfo: ''
      })
      .then(res => {
        if (res.code === 200) {
          this.props.history.push('/loading');
        } else if (res.code === 103) {
          Ins.showNotice(i18n.net_error_103);
        } else if (res.code === 101) {
          Ins.showNotice(i18n.net_error_101);
        } else {
          Ins.showNotice(res.error_msg);
        }
      })
      .catch(err => {
        Ins.showNotice(i18n.net_error_0);
        console.log(err);
      });
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
      <div className='rg-login-main rg-center-a rg-register-box'>
        <div className='rg-login-header'>
          <div className='rg-logo'></div>
          <span
            className='rg-icon-close'
            onClick={() => {
              this.props.history.goBack();
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
                placeholder={i18n.txt_hint_account_register}
                onChange={e => {
                  this.setState({userName: e.target.value});
                }}
                onBlur={e => {}}
                onFocus={e => {
                  this.setState({isShowUsersInfo: false});
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
              placeholder={i18n.txt_hint_password}
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
              placeholder={i18n.txt_input_psw_again}
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
        <div
          className='rg-btn-login'
          onClick={() => {
            this.register();
          }}
        >
          {i18n.txt_register}
        </div>
      </div>
    );
  }
}
