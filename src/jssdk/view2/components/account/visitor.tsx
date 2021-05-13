import * as React from 'react';
import Input from '../login/Input';
import {Ins} from '../../index';
/* 导入类型 */
import {RouteComponentProps} from 'react-router-dom';

export default class Visitor extends React.Component<RouteComponentProps, {}, any> {
  state = {
    userName: '',
    password1: '',
    password2: '',
    showPass: false
  };

  bindVisitor = () => {
    const {password1, password2, userName} = this.state;
    const i18n = RG.jssdk.config.i18n;
    if (!userName) {
      Ins.showNotice(i18n.txt_hint_account);
      return;
    }
    if (userName.length < 4 || userName.length > 50) {
      Ins.showNotice(i18n.net_error_004);
      return;
    }
    if (!password1) {
      Ins.showNotice(i18n.txt_hint_password);
      return;
    }
    if (!password2) {
      Ins.showNotice(i18n.txt_input_psw_again);
      return;
    }
    if (password1 != password2) {
      Ins.showNotice(i18n.net_error_006);
      return;
    }
    if (password1.length < 6 || password1.length > 20) {
      Ins.showNotice(i18n.net_error_005);
      return;
    }
    RG.jssdk
      .bindVisitor(userName, password1)
      .then(res => {
        if (res.code === 200) {
          RG.jssdk.config.popUpSwitch = false;
          RG.jssdk.app.showBindSuccess();
          Ins.showNotice(i18n.account_bind_success);
          this.props.history.replace('main');
        } else if (res.code === 108) {
          Ins.showNotice(i18n.net_error_108);
        } else {
          Ins.showNotice(res.error_msg);
        }
      })
      .catch(err => {
        Ins.showNotice(i18n.net_error_0);
        console.log(err);
      });
  };

  changeType = () => {
    this.setState({
      showPass: !this.state.showPass
    });
  };

  render() {
    const i18n = RG.jssdk.config.i18n;
    const {userName, password1, password2, showPass} = this.state;
    return (
      <div className='rg-center-a rg-account'>
        <div className='rg-login-header'>
          {i18n.float_button_bind_account}
          {/*  关闭按钮 */}
          <span
            className='rg-icon-close'
            onClick={() => {
              this.props.history.push('/main');
            }}
          ></span>
        </div>
        <div className='rg-login-wrap rg-register-wrap'>
          <div>
            {/* 账号 */}
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
          {/* 密码 */}
          <div className='rg-choose'>
            <span className='rg-icon-password'></span>
            <Input
              className='rg-password1'
              type={showPass ? 'text' : 'password'}
              value={password1}
              placeholder={i18n.txt_input_new_psw}
              onChange={e => {
                this.setState({password1: e.target.value});
              }}
            />
            {password1 ? (
              <span
                className='rg-icon-close'
                onClick={() => {
                  this.setState({password1: ''});
                }}
              ></span>
            ) : null}
          </div>
          <div className='rg-choose rg-hide-border'>
            <span className='rg-icon-password'></span>
            <Input
              className='rg-password2'
              type={showPass ? 'text' : 'password'}
              value={password2}
              placeholder={i18n.txt_input_new_psw_again}
              onChange={e => {
                this.setState({password2: e.target.value});
              }}
            />
            {password2 ? (
              <span
                className='rg-icon-close'
                onClick={() => {
                  this.setState({password2: ''});
                }}
              ></span>
            ) : null}
          </div>
        </div>
        {/* 是否显示密码 */}
        <div className='rg-check' onClick={this.changeType}>
          <div className={'rg-checkbox ' + (this.state.showPass ? 'rg-register-active' : '')}></div>
          <p className='rg-checkbox-txt'>{i18n.txt_show_pwd}</p>
        </div>
        {/* 绑定游客 */}
        <div
          className='rg-btn-login'
          onClick={() => {
            this.bindVisitor();
          }}
        >
          {i18n.cg_txt_confirm_submit}
        </div>
      </div>
    );
  }
}
