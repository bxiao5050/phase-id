import * as React from 'react';
import Input from './Input';
import {Ins} from '../../index';

/* 导入类型 */
import {RouteComponentProps} from 'react-router-dom';

export default class LoginBox extends React.Component<RouteComponentProps, {}> {
  state = {
    users: RG.jssdk.account.users,
    userName: '',
    password: '',
    isShowUsersInfo: false,
    closeUser: false,
    closePass: false
  };
  login() {
    const {userName, password} = this.state;
    const i18n = RG.jssdk.config.i18n;
    if (!userName) {
      Ins.showNotice(i18n.txt_hint_account);
      return;
    }
    if (!password) {
      Ins.showNotice(i18n.txt_hint_password);
      return;
    }
    RG.jssdk
      .platformLogin(userName, password)
      .then(res => {
        if (res.code === 200) {
          this.props.history.push('/loading');
        } else if (res.code === 102) {
          Ins.showNotice(i18n.net_error_102);
        } else {
          Ins.showNotice(res.error_msg);
        }
      })
      .catch(err => {
        Ins.showNotice(i18n.net_error_0);
        console.log(err);
      });
  }
  toggleUsersInfo() {
    this.setState({isShowUsersInfo: !this.state.isShowUsersInfo});
  }
  deleteUser(userId: number) {
    const i18n = RG.jssdk.config.i18n;
    const msg =
      i18n.txt_are_you_sure + this.state.users[userId].userName + i18n.txt_delete_from_table;
    Ins.showPrompt(i18n.txt_delete_account, msg).then(res => {
      if (res) {
        RG.jssdk.account.deleteUser(userId);
        delete this.state.users[userId];
        this.setState(this.state);
      }
    });
  }
  selectUser(userId: number) {
    const {userName, password} = this.state.users[userId];
    const i18n = RG.jssdk.config.i18n;
    RG.jssdk
      .platformLogin(userName, password)
      .then(res => {
        if (res.code === 200) {
          this.props.history.push('/loading');
        } else if (res.code === 102) {
          Ins.showNotice(i18n.net_error_102);
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
    const {isShowUsersInfo, userName, password} = this.state;
    const usersKeys = Object.keys(this.state.users);
    return (
      <div className='rg-login-main rg-center-a'>
        <div className='rg-login-header'>
          <div className='rg-logo'></div>
        </div>
        <div className='rg-login-wrap'>
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
              ) : usersKeys.length > 0 ? (
                <span className='rg-icon-down' onClick={() => this.toggleUsersInfo()}></span>
              ) : null}
            </div>
            {isShowUsersInfo ? (
              <ul className='rg-users-list'>
                {usersKeys.map(userId => {
                  const userInfo = this.state.users[userId];
                  return (
                    <li className='rg-user' key={userInfo.userId}>
                      <p className='rg-user-name' onClick={() => this.selectUser(userInfo.userId)}>
                        {(userInfo.userType === 0 ? i18n.txt_name_vistor : '') +
                          userInfo.userName.slice(0, 28)}
                      </p>
                      <div
                        className='rg-icon-close'
                        onClick={() => this.deleteUser(userInfo.userId)}
                      ></div>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
          <div className='rg-choose rg-hide-border'>
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
            ) : (
              <span
                className='rg-forget-text'
                onClick={() => {
                  this.props.history.push('/forget');
                }}
              >
                {i18n.txt_forget_password}
              </span>
            )}
          </div>
        </div>
        <div
          className='rg-btn-login'
          onClick={() => {
            this.login();
          }}
        >
          {i18n.txt_login_game}
        </div>
        <div
          onClick={() => {
            this.props.history.push('/main');
          }}
          className='to-main-btn'
        >
          {i18n.txt_change_login}
        </div>
        <div
          onClick={() => {
            this.props.history.push('/register');
          }}
          className='to-register-btn'
        >
          {i18n.txt_register_formal}
        </div>
      </div>
    );
  }
}
