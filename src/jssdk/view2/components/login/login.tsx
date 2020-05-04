// import './Entry.scss';
import * as React from 'react';
import {createLocation} from 'history';
// import Login from './index';
import Input from './Input';
import {Ins} from '../..//index';
import {UserInfo} from 'Src/jssdk/api/account';
import {RouteComponentProps} from 'react-router-dom';

export default class LoginBox extends React.Component<RouteComponentProps, {}> {
  state = {
    users: {
      1000003325: {
        accountType: 0,
        emailValid: 0,
        firstLogin: 0,
        password: 'b2ff93613c80dc62c3da2754cf91df59',
        token: 'bf8ae162ce054a8d8c69f2a2ddc24c1b',
        userId: 1000003325,
        userName: '1237699676',
        userType: 0
      },
      1000003322: {
        accountType: 0,
        emailValid: 0,
        firstLogin: 0,
        password: 'b2ff93613c80dc62c3da2754cf91df59',
        token: 'bf8ae162ce054a8d8c69f2a2ddc24c1b',
        userId: 1000003322,
        userName: '1237699676',
        userType: 0
      }
    },
    userName: '',
    password: '',
    isShowUsersInfo: false,
    closeUser: false,
    closePass: false
  };
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
  toggleUsersInfo() {
    this.setState({isShowUsersInfo: !this.state.isShowUsersInfo});
  }
  deleteUser(userId: number) {
    const i18n = RG.jssdk.config.i18n;
    const msg =
      i18n.txt_are_you_sure + this.state.users[userId].userName + i18n.txt_delete_from_table;
    Ins.showPrompt(i18n.txt_delete_account, msg).then(res => {
      if (res) {
        delete this.state.users[userId];
        this.setState(this.state);
      }
    });
  }
  selectUser(userId: number) {
    console.log(this.state.users[userId]);
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
              ) : usersKeys.length > 0 ? (
                <span className='rg-icon-down' onClick={() => this.toggleUsersInfo()}></span>
              ) : null}
            </div>
            {isShowUsersInfo ? (
              <ul className='rg-users-list'>
                {usersKeys.map(userId => {
                  const userInfo: UserInfo = this.state.users[userId];
                  return (
                    <li className='rg-user' key={userInfo.userId}>
                      <p className='rg-user-name' onClick={() => this.selectUser(userInfo.userId)}>
                        {(userInfo.userType === 0 ? i18n.txt_name_vistor : '') + userInfo.userName.slice(0,28)}
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
            ) : (
              <span
                className='rg-forget-text'
                onClick={() => {
                 this.props.history.push("/forget")
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
            // var {userName, password} = this.refs.choose.state;
            // this.login(userName, password);
          }}
        >
          {i18n.txt_login_game}
        </div>
        <div
          onClick={() => {
            this.props.history.push("/main")
          }}
          className='to-main-btn'
        >
          {i18n.txt_change_login}
        </div>
        <div
          onClick={() => {
            this.props.history.push("/register")
          }}
          className='to-register-btn'
        >
          {i18n.txt_register_formal}
        </div>
      </div>
    );
  }
}
