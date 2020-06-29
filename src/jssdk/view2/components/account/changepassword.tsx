import * as React from 'react';
import Input from '../login/Input';
import {Ins} from '../../index';
/* 导入类型 */
import {RouteComponentProps} from 'react-router-dom';

export default class ChangePassword extends React.Component<RouteComponentProps, {}, any> {
  state = {
    oldPassword: '',
    newPassword1: '',
    newPassword2: '',
    showPass: false
  };

  change = () => {
    const i18n = RG.jssdk.config.i18n;
    const {oldPassword, newPassword1, newPassword2} = this.state;
    if (!newPassword1) return Ins.showNotice(i18n.txt_input_old_psw);
    if (!newPassword2) return Ins.showNotice(i18n.txt_input_new_psw_again);
    if (newPassword1 != newPassword2) return Ins.showNotice(i18n.net_error_006);
    if (newPassword1.length < 6 || newPassword1.length > 20)
      return Ins.showNotice(i18n.net_error_005);

    RG.jssdk
      .changePassword(oldPassword, newPassword1)
      .then(res => {
        if (res.code === 200) {
          Ins.showNotice(i18n.psw_change_success);
          this.setState({
            oldPassword: '',
            newPassword1: '',
            newPassword2: '',
            showPass: false
          });
          this.props.history.replace('main');
        } else if (res.code == 107) {
          Ins.showNotice(i18n.net_error_107);
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
    const {oldPassword, newPassword1, newPassword2, showPass} = this.state;
    return (
      <div className='rg-login-main rg-center-a rg-account'>
        <div className='rg-login-header'>
          {i18n.txt_change_psw}
          <span
            className='rg-icon-close'
            onClick={() => {
              this.props.history.goBack();
            }}
          ></span>
        </div>
        <div className='rg-login-wrap rg-register-wrap'>
          <div>
            <div className='rg-choose'>
              <span className='rg-change-password-icon rg-change-icon'></span>
              <Input
                className='rg-userName'
                type='text'
                value={oldPassword}
                placeholder={i18n.txt_input_old_psw}
                onChange={e => {
                  this.setState({oldPassword: e.target.value});
                }}
              />
              {oldPassword ? (
                <span
                  className='rg-icon-close'
                  onClick={() => {
                    this.setState({oldPassword: ''});
                  }}
                ></span>
              ) : null}
            </div>
          </div>
          <div className='rg-choose'>
            <span className='rg-icon-password'></span>
            <Input
              className='rg-password1'
              type={showPass ? 'text' : 'password'}
              value={newPassword1}
              placeholder={i18n.txt_input_new_psw}
              onChange={e => {
                this.setState({newPassword1: e.target.value});
              }}
            />
            {newPassword1 ? (
              <span
                className='rg-icon-close'
                onClick={() => {
                  this.setState({newPassword1: ''});
                }}
              ></span>
            ) : null}
          </div>
          <div className='rg-choose rg-hide-border'>
            <span className='rg-icon-password'></span>
            <Input
              className='rg-password2'
              type={showPass ? 'text' : 'password'}
              value={newPassword2}
              placeholder={i18n.txt_input_new_psw_again}
              onChange={e => {
                this.setState({newPassword2: e.target.value});
              }}
            />
            {newPassword2 ? (
              <span
                className='rg-icon-close'
                onClick={() => {
                  this.setState({newPassword2: ''});
                }}
              ></span>
            ) : null}
          </div>
        </div>
        <div className='rg-check' onClick={this.changeType}>
          <div className={'rg-checkbox ' + (this.state.showPass ? 'rg-register-active' : '')}></div>
          <p className='rg-checkbox-txt'>{i18n.txt_show_pwd}</p>
        </div>
        <div className='rg-btn-login' onClick={() => {this.change()}}>
          {i18n.txt_confirm}
        </div>
      </div>
    );
  }
}
