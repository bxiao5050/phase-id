import * as React from 'react';
import APP from '../../App';
import {getAccountType} from 'Src/jssdk/utils';

/* 导入类型 */
import {RouteComponentProps} from 'react-router-dom';

export default class Loading extends React.Component<RouteComponentProps, {}, any> {
  state = {
    clock: null
  };

  componentDidMount() {
    this.setState({
      clock: setTimeout(() => {
        const {userType, accountType, firstLogin} = RG.jssdk.account.user;
        APP.instance.hideLogin();
        const isGuest = getAccountType(userType, accountType) === 'guest' ? true : false;
        APP.instance.showHover(isGuest);
        if (window.rgAsyncInit) {
          console.log('window.rgAsyncInit 已经调用');
          window.rgAsyncInit();
        }
        if (userType === 0 && RG.jssdk.config.popUpSwitch) {
          if (firstLogin === 1) {
            // 注册游客 30 分钟后弹窗
            const time = RG.jssdk.config.firstPopUpInterval
              ? RG.jssdk.config.firstPopUpInterval * 1000
              : 1800000;
            setTimeout(() => {
              // 如果用户已经升级就不再提示
              if (RG.jssdk.account.user.userType === 1) return;
              APP.instance.showBindTip();
            }, time);
          } else {
            // 登录时立即弹窗
            if (RG.jssdk.config.popUpInterval !== 0) {
              APP.instance.showBindTip();
            }
            //  每隔一段时间弹一次绑定弹窗
            APP.instance.autoShowBindTip();
          }
        }
        if (
          RG.jssdk.account.user.userType === 1 &&
          RG.jssdk.account.user.firstLogin === 1 &&
          RG.type === 1
        ) {
          APP.instance.showRegisterSuccess();
        }
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
    const i18n = RG.jssdk.config.i18n;
    const user = RG.jssdk.account.user;
    return (
      <div className='rg-login-main rg-loading rg-center-a'>
        <h2 className='rg-logo'></h2>
        <div className='rg-loading-info'>
          <p className='rg-loading-userName'>
            <span className='rg-loading-userName-label'>{i18n.txt_account_name}</span>{' '}
            <span className='rg-loading-userName-txt'>
              {user.nickName || user.email || user.userName.slice(0, 24)}
            </span>
          </p>

          {user.emailValid ? null : <p className='rg-loading-valid'>{i18n.txt_tips_bind}</p>}
          <div className='rg-loading-txt'>
            <span className='rg-loading-icon'></span>
            {i18n.txt_logining}
          </div>
        </div>

        <div
          className='rg-loading-change'
          onClick={() => {
            this.unclock();
            this.props.history.goBack();
          }}
        >
          <span className='rg-icon-switch'></span>
          {i18n.txt_switch_account}
        </div>
      </div>
    );
  }
}
