import './Choose.scss';
import * as React from 'react';
import {Route} from 'react-router-dom';
import Login from './index';
import {Ins} from 'Src/jssdk/view/index';
import {getAccountType} from 'Src/jssdk/utils';
/* 类型 */
import {UserInfo} from 'Src/jssdk/api/account';

type ChooseProps = {
  Login: Login;
};

export default class Choose extends React.Component<ChooseProps, {}, any> {
  constructor(props: ChooseProps) {
    super(props);
  }

  state = {
    users: RG.jssdk.account.users,
    userName: '',
    password: '',
    showList: false,
    closeUser: false,
    closePass: false
  };

  showAccounts = () => {
    this.state.showList = !this.state.showList;
    this.setState(this.state);
  };
  login(user: UserInfo) {
    const {userName, password} = user;
    const i18n = RG.jssdk.config.i18n;
    RG.jssdk
      .platformLogin(userName, password)
      .then(res => {
        if (res.code === 200) {
          this.props.Login.loginComplete();
        } else if (res.code === 102) {
          Ins.showNotice(i18n.code102);
        } else if (res.code === 101) {
          Ins.showNotice(i18n.code101);
        } else {
          Ins.showNotice(res.error_msg);
        }
      })
      .catch(err => {
        Ins.showNotice(i18n.UnknownErr);
        console.log(err);
      });
  }
  willUnmount = false;

  componentWillUnmount() {
    this.willUnmount = true;
  }

  setState(state) {
    if (!this.willUnmount) super.setState(state);
  }

  deleteUser = userId => {
    RG.jssdk.account.deleteUser(userId);
    delete this.state.users[userId];
    var usersKeys = Object.keys(this.state.users);
    if (!usersKeys.length && this.props.Login.props.history.location.pathname === '/main') {
      this.props.Login.props.history.replace('/main');
    } else {
      this.setState(this.state);
    }
  };

  clearUser = () => {
    this.state.closeUser = false;
    this.state.userName = '';
    this.setState(this.state);
  };

  clearPassword = () => {
    this.setState({
      password: '',
      closePass: false
    });
  };

  onChange = e => {
    if (e.target.id === 'username') {
      var userName = e.target.value;
      this.setState({
        userName: userName,
        closeUser: userName.length > 0,
        showList: !(userName.length > 0)
      });
    } else if (e.target.id === 'password') {
      var password = e.target.value;
      this.setState({
        password: password,
        closePass: password.length > 0
      });
    }
  };

  blurInput = name => {
    setTimeout(() => {
      if (name == 'userName') {
        this.setState({
          closeUser: false
        });
      } else {
        this.setState({
          closePass: false
        });
      }
    }, 100);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  };

  focusInput = name => {
    if (name == 'userName' && this.state.userName.length > 0) {
      this.setState({
        closeUser: true
      });
    } else if (name == 'password' && this.state.password.length > 0) {
      this.setState({
        closePass: true
      });
    }
  };

  render() {
    var usersKeys = Object.keys(this.state.users);
    return (
      <div className='box-input choose'>
        <div className='line-input rg-username'>
          <div className='icon'></div>
          <input
            type='text'
            placeholder={RG.jssdk.config.i18n.dom001}
            id='username'
            value={this.state.userName}
            onChange={e => this.onChange(e)}
            onBlur={() => this.blurInput('userName')}
            onFocus={() => this.focusInput('userName')}
            onClick={this.showAccounts}
          />
          <div
            className={'icon-close ' + (this.state.closeUser ? 'active' : '')}
            onClick={this.clearUser}
          ></div>
          <div className='icon-down' onClick={this.showAccounts}></div>
          <div className='accounts'>
            <ul className={'list-account' + (this.state.showList ? ' active' : '')}>
              {usersKeys.map(userId => {
                const userInfo: UserInfo = this.state.users[userId];
                return (
                  <li key={userInfo.userId}>
                    <p
                      onClick={() => {
                        this.login(userInfo);
                        this.showAccounts();
                      }}
                    >
                      {
                        /* getAccountType(userInfo.userType, userInfo.accountType) +
                        ' : ' + */
                        userInfo.userName
                      }
                    </p>
                    <div
                      className='icon-close'
                      onClick={this.deleteUser.bind(this, userInfo.userId)}
                    ></div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <Route
          exact
          path={'/entry'}
          render={() => (
            <div className='line-input rg-password'>
              <div className='icon'></div>
              <input
                type='password'
                placeholder={RG.jssdk.config.i18n.dom002}
                value={this.state.password}
                onChange={e => this.onChange(e)}
                id='password'
                onBlur={() => this.blurInput('password')}
                onFocus={() => this.focusInput('password')}
              />
              <div
                className={'icon-close ' + (this.state.closePass ? 'active' : '')}
                onClick={this.clearPassword}
              ></div>
              <a className='forget'></a>
            </div>
          )}
        />
      </div>
    );
  }
}
