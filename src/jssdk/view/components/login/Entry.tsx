import './Entry.scss';
import * as React from 'react';
import {createLocation} from 'history';
import {Ins} from 'Src/jssdk/view/index';
import Login from './index';
import Choose from './Choose';

type EntryProp = {
  Login: Login;
};

export default class Entry extends React.Component<EntryProp, {}, any> {
  public refs: {
    choose: Choose;
  };

  constructor(props: EntryProp) {
    super(props);
  }
  login(userName: string, password: string) {
    if (!userName || !password) {
      return;
    }
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
  render() {
    return (
      <div className='content win-account'>
        <div className='header'>
          <div className='icon-head'></div>
        </div>
        <div className='wrapper'>
          <Choose ref='choose' Login={this.props.Login} />
          <a
            className='btn-login'
            onClick={() => {
              var {userName, password} = this.refs.choose.state;
              this.login(userName, password);
            }}
          >
            {RG.jssdk.config.i18n.dom005}
          </a>
          <div className='box-link'>
            <a
              onClick={() => {
                this.props.Login.props.history.goBack();
              }}
              className='link-change'
            >
              &lt;&lt; {RG.jssdk.config.i18n.dom003}
            </a>
            <a
              onClick={() => {
                this.props.Login.props.history.push(createLocation('/register'));
              }}
              className='link-register'
            >
              {RG.jssdk.config.i18n.dom004} &gt;&gt;
            </a>
          </div>
        </div>
      </div>
    );
  }
}
