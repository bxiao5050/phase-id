import * as React from 'react';
import {Ins} from '../../index';
/* 导入类型 */
import {RouteComponentProps} from 'react-router-dom';

export default class Main extends React.Component<RouteComponentProps, {}> {
  state = {
    isShowUsersInfo: false,
    deviceNo: ''
  };
  isUpdate = true;
  async componentDidMount() {
    const deviceMsg = await RG.jssdk.devicePromise;
    this.state.deviceNo = deviceMsg.hasOwnProperty('device')
      ? deviceMsg.device
      : deviceMsg.deviceNo;
    if (this.isUpdate) {
      this.setState(this.state);
    }
  }
  componentWillUnmount() {
    this.isUpdate = false;
  }
  copyDeviceNo() {
    Ins.copy(this.state.deviceNo, RG.jssdk.config.i18n.txt_copy_success);
  }
  copyUserInfo() {
    Ins.copyUserInfo();
  }
  render() {
    const i18n = RG.jssdk.config.i18n;
    const user = RG.jssdk.account.user;
    const history = this.props.history;
    const isGuest = user.userType === 0;
    const isFacebook = user.accountType === 2;
    return (
      <div className='rg-account rg-center-a'>
        <div className='rg-login-header'>
          {i18n.txt_title_user_center}
          <span
            className='rg-icon-close'
            onClick={() => {
              Ins.toggleAccount(false);
            }}
          ></span>
        </div>
        <div className='rg-account-content'>
          <div className='rg-account-userInfo-wrap clearfix'>
            <div className='rg-avatar-icon'></div>
            <div className='rg-account-userInfo'>
              <p className='rg-account-username'>
                <span>{i18n.txt_account_name}</span>&nbsp;
                {user.userName}
              </p>
              <p className='rg-account-userId'>
                <span>{RG.jssdk.config.type === 2 ? i18n.txt_device_num : 'UID: '}</span>
                <span>
                  {RG.jssdk.config.type === 2
                    ? `${this.state.deviceNo}`
                    : `${RG.CurUserInfo().userId}`}
                </span>
                <span
                  className='rg-copy-divice-btn'
                  onClick={() => {
                    this.copyDeviceNo();
                  }}
                >
                  {i18n.txt_copy}
                </span>
              </p>
              {!isGuest ? (
                <p className='rg-account-userId'>
                  <span>{i18n.userNameAndPwdTxt}</span>
                  <span
                    className='rg-copy-divice-btn'
                    onClick={() => {
                      this.copyUserInfo();
                    }}
                  >
                    {i18n.txt_copy}
                  </span>
                </p>
              ) : null}
            </div>
          </div>
          <ul className='rg-account-operatings'>
            {isGuest ? (
              <li
                className='rg-account-operating'
                onClick={() => {
                  history.push('/visitor');
                }}
              >
                <span className='rg-change-icon'></span>
                <span>{i18n.float_button_bind_account}</span>
                <span className='rg-right-icon'></span>
              </li>
            ) : null}
            {!(isGuest || isFacebook) ? (
              <li
                className='rg-account-operating'
                onClick={() => {
                  history.push('/change-password');
                }}
              >
                <span className='rg-change-icon'></span>
                <span>{i18n.txt_change_psw}</span>
                <span className='rg-right-icon'></span>
              </li>
            ) : null}
            {!isGuest ? (
              <li
                className='rg-account-operating'
                onClick={() => {
                  if (user.emailValid !== 0) return;
                  if (isFacebook) return;
                  history.push('/email');
                }}
              >
                <span className='rg-email-icon'></span>
                <span>{i18n.txt_safe_set}</span>
                {user.emailValid === 0 ? <span className='rg-right-icon'></span> : null}

                <span className='rg-email-valid-txt'>
                  {user.emailValid === 0 ? i18n.txt_warning_safe : user.email}
                </span>
              </li>
            ) : null}
            <li
              className='rg-account-operating'
              onClick={() => {
                Ins.toggleAccount(false);
                RG.Redirect();
              }}
            >
              <span className='rg-switch-icon'></span>
              <span>{i18n.txt_switch_account}</span>
              <span className='rg-right-icon'></span>
            </li>
            <li
              className='rg-account-operating'
              onClick={() => {
                history.push('/history');
              }}
            >
              <span className='rg-history-icon'></span>
              <span>{i18n.txt_check_charge}</span>
              <span className='rg-right-icon'></span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
