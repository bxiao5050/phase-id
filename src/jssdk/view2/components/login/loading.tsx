// import './Loading.scss';
import * as React from 'react';
import {Ins} from '../../index';
// import {getAccountType} from 'Src/jssdk/utils';
// import Login from './index';

import {RouteComponentProps} from 'react-router-dom';
type LoadingProp = {
  // Login: Login
};

export default class Loading extends React.Component<LoadingProp, {}, any> {
  state = {
    clock: null,
    user: {
      accountType: 0,
      emailValid: 0,
      firstLogin: 0,
      password: 'b2ff93613c80dc62c3da2754cf91df59',
      token: 'bf8ae162ce054a8d8c69f2a2ddc24c1b',
      userId: 1000003322,
      userName: '1237699676',
      userType: 0
    }
  };

  componentDidMount() {
    // this.setState({
    //   clock: setTimeout(() => {
    //     // var {userType, accountType} = RG.jssdk.account.user;
    //     Ins.hideLogin();
    //     // var isGuest = getAccountType(userType, accountType) === 'guest' ? true : false;
    //     // Ins.showHover(isGuest);
    //     // if (window.rgAsyncInit) {
    //     //   window.rgAsyncInit();
    //     // }
    //   }, 2000)
    // });
  }

  unclock = () => {
    // clearTimeout(this.state.clock);
  };

  componentWillUnmount() {
    // this.unclock();
  }

  render() {
    const i18n = RG.jssdk.config.i18n;
    const {user} = this.state;
    // var user: any = RG.jssdk.account.user;
    // var password: string = user.password;
    return (
      <div className='rg-login-main rg-loading rg-center-a'>
        <h2 className='rg-logo'></h2>
        <div className='rg-loading-info'>
          <p className='rg-loading-userName'>
            <span className='rg-loading-userName-label'>{i18n.txt_account_name}</span>{' '}
            <span className='rg-loading-userName-txt'>{user.userName.slice(0, 24)}</span>
          </p>

          {user.emailValid ? null : <p className='rg-loading-valid'>{i18n.txt_tips_bind}</p>}
          <div className='rg-loading-txt' ><span className="rg-loading-icon"></span>{i18n.txt_logining}</div>
        </div>

        <div
          className='rg-loading-change'
          onClick={() => {
            // this.unclock();
            // this.props.Login.props.history.goBack();
          }}
        >
          <span className='rg-icon-switch'></span>
         {i18n.txt_switch_account}
        </div>
      </div>
    );
  }
}
