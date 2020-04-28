// import './Loading.scss';
import * as React from 'react';
import {Ins} from '../../index';
// import {getAccountType} from 'Src/jssdk/utils';
// import Login from './index';

type LoadingProp = {
  // Login: Login
};

export default class Loading extends React.Component<LoadingProp, {}, any> {

  state = {
    clock: null
  };

  componentDidMount() {
    this.setState({
      clock: setTimeout(() => {
        // var {userType, accountType} = RG.jssdk.account.user;
        Ins.hideLogin();
        // var isGuest = getAccountType(userType, accountType) === 'guest' ? true : false;
        // Ins.showHover(isGuest);
        // if (window.rgAsyncInit) {
        //   window.rgAsyncInit();
        // }
      }, 2000)
    });
  }

  unclock = () => {
    clearTimeout(this.state.clock);
  };

  componentWillUnmount() {
    this.unclock();
  }

  render() {
    // var user: any = RG.jssdk.account.user;
    // var password: string = user.password;
    return (
      <div className='content win-loading'>
        <h2 className='logo'></h2>
        <div className='info'>
          <p>{/* {RG.jssdk.config.i18n.txt_account_name} <span>{user.userName}</span> */}</p>
          <p>
            {/* {RG.jssdk.config.i18n.dom007}:{' '}
            <span>{(password ? password.substring(0, 10) : '') + '...'}</span> */}
          </p>
        </div>
        {/* <div className='loading'>{RG.jssdk.config.i18n.dom005}</div> */}
        <div className='line' />
        <a
          className='change'
          onClick={() => {
            this.unclock();
            // this.props.Login.props.history.goBack();
          }}
        >
          <span className='switch' />
          {/* <span>{RG.jssdk.config.i18n.dom003}</span> */}
        </a>
      </div>
    );
  }
}