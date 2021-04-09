import * as React from 'react';
import Input from '../login/Input';
import {Ins} from '../../index';

/* 导入类型 */
import {RouteComponentProps} from 'react-router-dom';

export default class ForgetPassword extends React.Component<RouteComponentProps, {}> {
  state = {
    email: '',
    password: '',
    showTable: 'password'
  };
  verifyPassword() {
    const i18n = RG.jssdk.config.i18n;
    if (!this.state.password) return Ins.showNotice(i18n.txt_hint_password);

    RG.jssdk
      .verifyPassword(this.state.password)
      .then(res => {
        if (res.code == 200) {
          this.setState({showTable: 'email'});
        } else if (res.code == 107) {
          Ins.showNotice(i18n.net_error_107);
        } else {
          Ins.showNotice(res.error_msg);
        }
      })
      .catch(err => {
        Ins.showNotice(i18n.net_error_0);
        console.log(err);
      });
  }
  bindEmail() {
    const i18n = RG.jssdk.config.i18n;
    if (!this.state.email) return Ins.showNotice(i18n.cg_txt_hint_input_email);
    if (this.state.email.indexOf('@') === -1) return Ins.showNotice(i18n.txt_input_valid_email);
    RG.jssdk
      .operatorEmail(this.state.email)
      .then(res => {
        if (res.code == 200) {
          RG.jssdk.account.user = Object.assign({}, RG.jssdk.account.user, {
            email: this.state.email,
            emailValid: 1
          });
          Ins.showNotice(i18n.net_error_200);
          this.props.history.replace('/main');
        } else {
          Ins.showNotice(res.error_msg);
        }
      })
      .catch(err => {
        Ins.showNotice(i18n.net_error_0);
        console.log(err);
      });
  }
  render() {
    const i18n = RG.jssdk.config.i18n;
    const {email, showTable, password} = this.state;
    return (
      <div className='rg-center-a rg-account rg-email'>
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
                    type='password'
                    value={password}
                    placeholder={i18n.txt_hint_password}
                    onChange={e => {
                      this.setState({password: e.target.value});
                    }}
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
                    value={email}
                    placeholder={i18n.cg_txt_hint_input_email}
                    onChange={e => {
                      this.setState({email: e.target.value});
                    }}
                  />
                  {email ? (
                    <span
                      className='rg-icon-close'
                      onClick={() => {
                        this.setState({email: ''});
                      }}
                    ></span>
                  ) : null}
                </div>
              </div>
            </div>
            <div
              className='rg-btn-login'
              onClick={() => {
                this.bindEmail();
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
