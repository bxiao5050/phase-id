import * as React from 'react';
import {Route} from 'react-router-dom';
import {createLocation} from 'history';
// import Login from './index';
// import Choose from './Choose';
import {Ins} from '../../index';
// import Account from "../../../Base/Account";
/* 导入类型 */
import {RouteComponentProps} from 'react-router-dom';
import {UserInfo} from 'Src/jssdk/api/account';

interface IState {
  users: {
    [key: string]: UserInfo;
  };
  isShowUsersInfo: boolean;
}
export default class Main extends React.Component<RouteComponentProps, IState> {
  public refs: {
    // choose: Choose;
  };
  // facebookLogin() {
  //   RG.jssdk
  //     .fbLogin(true)
  //     .then(res => {
  //       if (res && res.code === 200) {
  //         // this.props.Login.loginComplete();
  //       } else {
  //         Ins.showNotice(RG.jssdk.config.i18n.UnknownErr);
  //         console.log(res);
  //       }
  //     })
  //     .catch(e => {
  //       Ins.showNotice(RG.jssdk.config.i18n.UnknownErr);
  //       console.log(e);
  //     });
  // }
  // visitorRegister() {
  //   RG.jssdk.visitorRegister().then(res => {
  //     if (res.code === 200) {
  //       // this.props.Login.loginComplete();
  //     } else {
  //       Ins.showNotice(RG.jssdk.config.i18n.UnknownErr);
  //       console.log(res);
  //     }
  //   });
  // }
  // test = () => {
  //   this.props.history.push("/loading")
  // }

  state = {
    // users: RG.jssdk.account.users
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
        userName: '1237699676 bf8ae162ce054a8d8c69f2a2ddc24c1b',
        userType: 0
      }
    },
    isShowUsersInfo: false
  };
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
  toggleUsersInfo() {
    this.setState({isShowUsersInfo: !this.state.isShowUsersInfo});
  }
  render() {
    const isShowChoose = Object.keys(this.state.users).length !== 0;
    const i18n = RG.jssdk.config.i18n;
    const usersKeys = Object.keys(this.state.users);
    const {isShowUsersInfo} = this.state;
    return (
      <div className='rg-login-main rg-center-a'>
        <h2 className='rg-logo'></h2>
        {isShowChoose ? (
          <div className='rg-choose-wrap'>
            <div className='rg-choose' onClick={() => this.toggleUsersInfo()}>
              <span className='rg-icon-user'></span>
              <span className='rg-choose-text'>{i18n.txt_select_account}</span>
              <span className='rg-icon-down'></span>
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
        ) : (
          <div
            className='rg-guest-btn'
            onClick={() => {
              // this.visitorRegister();
            }}
          >
            {i18n.txt_fast}
          </div>
        )}
        <div
          className='rg-fb-btn'
          onClick={() => {
            // if (RG.jssdk.config.fb_sdk_loaded) {
            //   Ins.showNotice(RG.jssdk.config.i18n.loading);
            //   this.facebookLogin.apply(this);
            // } else {
            //   Ins.showNotice(RG.jssdk.config.i18n.loadException);
            // }
          }}
        >
          <span className='rg-icon-fb ' />
          <span>&nbsp;&nbsp;{i18n.txt_facebook_login}</span>
        </div>
        <div className='rg-line'>
          <div className='rg-line-left'></div>
          {i18n.txt_other_login}
          <div className='rg-line-right'></div>
        </div>
        <div className='rg-others'>
          <div
            className='rg-to-login'
            onClick={() => {
              this.props.history.push("/login");
            }}
          >
            <div className='rg-login-icon'></div>
            {i18n.txt_login}
          </div>
          <div
            className='rg-to-register'
            onClick={() => {
              this.props.history.push("/register");
            }}
          >
            <div className='rg-register-icon'></div>
            {i18n.txt_register_usa}
          </div>
        </div>
      </div>
    );
  }
}
