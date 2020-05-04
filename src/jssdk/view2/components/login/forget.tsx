// import './Entry.scss';
import * as React from 'react';
import {createLocation} from 'history';
// import Login from './index';
import Input from './Input';
import {Ins} from '../..//index';
import {UserInfo} from 'Src/jssdk/api/account';
import {RouteComponentProps} from 'react-router-dom';

export default class ForgetPassword extends React.Component<RouteComponentProps, {}> {
  state = {
    userName: '',
    showTable: 'password',
    time: 0
  };
  forgetPassword() {
    const i18n = RG.jssdk.config.i18n;
    const {time, userName} = this.state;
    if (time) return;
    if (!userName) return Ins.showNotice(i18n.txt_hint_account);
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
  toggleTable(type: string) {
    if (this.state.showTable === type) return;
    this.setState({showTable: type});
  }
  render() {
    const i18n = RG.jssdk.config.i18n;
    const {userName, showTable, time} = this.state;
    return (
      <div className='rg-login-main rg-center-a'>
        <div className='rg-login-header'>
          <div className='rg-logo'></div>
          <span
            className='rg-icon-close'
            onClick={() => {
              this.props.history.goBack();
            }}
          ></span>
        </div>
        <div className='rg-forget-table'>
          <div
            className={
              showTable === 'password'
                ? 'rg-forget-password-btn rg-forget-active'
                : 'rg-forget-password-btn'
            }
            onClick={() => {
              this.toggleTable('password');
            }}
          >
            {i18n.txt_find_pwd}
          </div>
          <div
            className={
              showTable === 'username'
                ? 'rg-forget-username-btn rg-forget-active'
                : 'rg-forget-username-btn'
            }
            onClick={() => {
              this.toggleTable('username');
            }}
          >
            {i18n.txt_find_account}
          </div>
        </div>
        {showTable === 'password' ? (
          <div className='rg-forget-password'>
            <div className='rg-forget-wrap'>
              <div className='rg-login-choose-wrap'>
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
                    onBlur={() => {}}
                    onFocus={() => {
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
            </div>
            <div
              className={time ? 'rg-btn-login rg-time-active' : 'rg-btn-login'}
              onClick={() => {
                this.forgetPassword();
              }}
            >
              {i18n.txt_confirm + (time ? `(${time})` : '')}
            </div>
          </div>
        ) : (
          <div className='rg-forget-panel'>
            <div className='rg-forget-username'>{i18n.ui_forget_account_hint}</div>
          </div>
        )}
      </div>
    );
  }
}
// txt_confirm
