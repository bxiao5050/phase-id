import * as React from 'react';
import Input from '../login/Input';
import {Ins} from '../../index';

import {RouteComponentProps} from 'react-router-dom';

export default class ForgetPassword extends React.Component<RouteComponentProps, {}> {
  state = {
    email: '',
    password: '',
    showTable: 'password'
  };
  verifyPassword() {
    this.setState({showTable:'email'})
  }
  bindEmail() {}
  forgetPassword() {
    const i18n = RG.jssdk.config.i18n;
    const {password, email} = this.state;
    if (password) return;
    if (!email) return Ins.showNotice(i18n.txt_hint_account);
    // if (true) {
    //   this.setState({time: 60});
    //   const timer = setInterval(() => {
    //     const time = this.state.time - 1;
    //     this.setState({time});
    //     if (!time) clearInterval(timer);
    //   }, 1000);
    //   Ins.showPrompt(i18n.txt_send_success, i18n.txt_send_email_success, true);
    // } else {
    //   Ins.showPrompt(i18n.txt_send_fail, i18n.net_error_106, true);
    // }
  }
  render() {
    const i18n = RG.jssdk.config.i18n;
    const {email, showTable, password} = this.state;
    return (
      <div className='rg-login-main rg-center-a rg-account rg-email'>
        <div className='rg-login-header'>
          {i18n.txt_safe_set}
          <span
            className='rg-icon-close'
            onClick={() => {
              this.props.history.goBack();
            }}
          ></span>
        </div>
        <div className='rg-email-table clearfix'>
          <div className='rg-email-password-btn rg-email-active'>
            <div className='rg-email-one'>{i18n.cg_txt_step_one}</div>
            <div className='rg-email-line'></div>
          </div>
          <div className={showTable === 'email' ? 'rg-email-btn rg-email-active' : 'rg-email-btn'}>
            <div className='rg-email-one'>{i18n.cg_txt_step_two}</div>
            <div className='rg-email-line'></div>
          </div>
        </div>
        {showTable === 'password' && (
          <div className='rg-forget-password'>
            <p className='rg-email-password-tip'>{i18n.txt_verify_pwd}</p>
            <div className='rg-forget-wrap'>
              <div className='rg-login-choose-wrap'>
                <div className='rg-choose'>
                  <span className='rg-icon-password'></span>
                  <Input
                    className='rg-password'
                    type='text'
                    value={password}
                    placeholder={i18n.txt_hint_password}
                    onChange={e => {
                      this.setState({password: e.target.value});
                    }}
                    onBlur={() => {}}
                    onFocus={() => {}}
                  />
                  {password ? (
                    <span
                      className='rg-icon-close'
                      onClick={() => {
                        this.setState({password: ''});
                      }}
                    ></span>
                  ) : null}
                </div>
              </div>
            </div>
            <div
              className='rg-btn-login'
              onClick={() => {
                this.verifyPassword();
              }}
            >
              {i18n.cg_txt_confirm_submit}
            </div>
          </div>
        )}
        {showTable === 'email' && (
          <div className='rg-forget-password'>
            <p className='rg-email-password-tip'>{i18n.txt_bind_warn}</p>
            <div className='rg-forget-wrap'>
              <div className='rg-login-choose-wrap'>
                <div className='rg-choose'>
                  <span className='rg-email-icon rg-change-password-icon'></span>
                  <Input
                    className='rg-password'
                    type='text'
                    value={password}
                    placeholder={i18n.cg_txt_hint_input_email}
                    onChange={e => {
                      this.setState({password: e.target.value});
                    }}
                    onBlur={() => {}}
                    onFocus={() => {}}
                  />
                  {password ? (
                    <span
                      className='rg-icon-close'
                      onClick={() => {
                        this.setState({password: ''});
                      }}
                    ></span>
                  ) : null}
                </div>
              </div>
            </div>
            <div
              className='rg-btn-login'
              onClick={() => {
                this.verifyPassword();
              }}
            >
              {i18n.cg_txt_confirm_submit}
            </div>
          </div>
        )}
      </div>
    );
  }
}
