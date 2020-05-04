import * as React from 'react';
import {Route} from 'react-router-dom';
import {createLocation} from 'history';
// import Login from './index';
// import Choose from './Choose';
import {Ins} from '../../index';
/* 导入类型 */
import {RouteComponentProps} from 'react-router-dom';

export default class Main extends React.Component<RouteComponentProps, {}> {
  state = {
    user: {
      accountType: 0,
      emailValid: 0,
      firstLogin: 0,
      password: 'b2ff93613c80dc62c3da2754cf91df59',
      token: 'bf8ae162ce054a8d8c69f2a2ddc24c1b',
      userId: 1000003325,
      userName: '01234567890123456789012345678',
      userType: 0
    },
    isShowUsersInfo: false
  };
  render() {
    const i18n = RG.jssdk.config.i18n;
    const {user} = this.state;
    const history = this.props.history;
    return (
      <div className='rg-login-main rg-account rg-center-a'>
        <div className='rg-login-header'>
          {i18n.txt_title_user_center}
          <span
            className='rg-icon-close'
            onClick={() => {
              Ins.toggleAccount(false);
            }}
          ></span>
        </div>
        <div className='rg-customer-content rg-account-content'>
          <div className='rg-account-userInfo-wrap'>
            <div className='rg-avatar-icon'></div>
            <div className='rg-account-userInfo'>
              <p className='rg-account-username'>
                <span>{i18n.txt_account_name}</span>&nbsp;
                {user.userName}
              </p>
              <p className='rg-account-userId'>
                <span>{i18n.txt_device_num}</span>
                {'01234567890123456789012'.length > 10
                  ? '01234567890123456789012'.slice(0, 12) + '...'
                  : '01234567890123456789012'}
                <span
                  className='rg-copy-divice-btn'
                  onClick={() => Ins.showPrompt(i18n.txt_copy, '012345678901234567890123', true)}
                >
                  {i18n.txt_copy}
                </span>
              </p>
            </div>
          </div>
          <ul className='rg-account-operatings'>
            <li className='rg-account-operating' onClick={() => {history.push("/visitor")}}>
              <span className='rg-main-icon rg-change-icon'></span>
              <span>{i18n.float_button_bind_account}</span>
              <span className='rg-right-icon'></span>
            </li>
            <li className='rg-account-operating' onClick={() => {history.push("/change-password")}}>
              <span className='rg-main-icon rg-change-icon'></span>
              <span>{i18n.txt_change_psw}</span>
              <span className='rg-right-icon'></span>
            </li>
            <li className='rg-account-operating' onClick={() => {history.push("/email")}}>
              <span className='rg-main-icon rg-email-icon'></span>
              <span>{i18n.txt_safe_set}</span>
              <span className='rg-right-icon'></span>
              <span className='rg-email-valid-txt'>{i18n.txt_warning_safe}</span>
            </li>
            <li className='rg-account-operating' onClick={() => {}}>
              <span className='rg-main-icon rg-switch-icon'></span>
              <span>{i18n.txt_switch_account}</span>
              <span className='rg-right-icon'></span>
            </li>
            <li className='rg-account-operating' onClick={() => {history.push("/history")}}>
              <span className='rg-main-icon rg-history-icon'></span>
              <span>{i18n.txt_check_charge}</span>
              <span className='rg-right-icon'></span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
