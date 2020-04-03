import './index.scss';
import * as React from 'react';
import {Switch, Route, Link} from 'react-router-dom';
import {History, createLocation} from 'history';
import {Ins} from 'Src/jssdk/view/index';
import {match} from 'react-router-dom';
import {getAccountType} from 'Src/jssdk/utils';

type accountProps = {
  match?: match<{curPath: string}>;
  history?: History;
};

class Main extends React.Component<accountProps, any, any> {
  state = {
    deviceNo: ''
  };

  componentDidMount() {
    RG.jssdk.devicePromise.then(device => {
      this.state.deviceNo = device.hasOwnProperty('device') ? device.device : device.deviceNo;
      this.setState(this.state);
    });
  }

  changeAccount = async () => {
    await Promise.race([
      RG.ChangeAccount(),
      new Promise(function(resolve) {
        setTimeout(function() {
          resolve();
        }, 1000);
      })
    ]);
    RG.Redirect();
  };

  render() {
    var props = this.props;
    var {userType, accountType} = RG.jssdk.account.user;
    const userTypeIsFB = getAccountType(userType, accountType) === 'fb';

    return (
      <div className='info-main'>
        <div className='info-account'>
          <div className='info-head'></div>
          <div className='info-msg'>
            <p className='info-name'>
              {RG.jssdk.config.i18n.txt_account_name} {RG.CurUserInfo().userName}
            </p>
            <p className='info-id'>
              <span>
                {RG.jssdk.config.type === 2
                  ? `${RG.jssdk.config.i18n.txt_device_num} ${this.state.deviceNo}`
                  : `UID: ${RG.CurUserInfo().userId}`}
              </span>
              {/* <span className="copy">Copy</span> */}
            </p>
            {/* <a className="pay-his" onClick={() => {
            RG.jssdk.GetPaymentHistory().then((data: any) => {
              if (data.data.length) {
                props.history.push(createLocation('/payment-history', {
                  data
                }))
              } else {
                Ins.showNotice(RG.jssdk.config.i18n.p2refresh_end_no_records)
              }
            })
          }}>{RG.jssdk.config.i18n.txt_check_charge}</a> */}
          </div>
        </div>
        <div className='others'>
          <a
            className={userTypeIsFB ? 'item-other setting' : 'item-other'}
            onClick={() => {
              !userTypeIsFB && props.history.push(createLocation('/change-password'));
            }}
          >
            <img src={require('../../assets/ui_setting.png')} />
            <p>{RG.jssdk.config.i18n.dom010}</p>
            <img src={require('../..//assets/ui_right_arrow.png')} className='right' />
          </a>
          <a
            className='item-other setting'
            onClick={() => {
              // RG.Install && RG.Install('仙靈計', 'http://xianlingji.bilivfun.com/xlj')
            }}
          >
            <img src={require('../..//assets/ui_email.png')} />
            <p>{RG.jssdk.config.i18n.txt_safe_set}</p>
            <img src={require('../..//assets/ui_right_arrow.png')} className='right' />
          </a>
          <a className='item-other' onClick={this.changeAccount}>
            <img src={require('../..//assets/ui_switch_account.png')} />
            <p>{RG.jssdk.config.i18n.dom003}</p>
            <img src={require('../..//assets/ui_right_arrow.png')} className='right' />
          </a>
          <a
            className='item-other'
            onClick={() => {
              RG.jssdk.getPaymentHistoryList().then((data: any) => {
                if (data.data.length) {
                  props.history.push(
                    createLocation('/payment-history', {
                      data
                    })
                  );
                } else {
                  Ins.showNotice(RG.jssdk.config.i18n.p2refresh_end_no_records);
                }
              });
            }}
          >
            <img src={require('../..//assets/fb_user_center_0.png')} className='pay-his-icon' />
            <p>{RG.jssdk.config.i18n.txt_check_charge}</p>
            <img src={require('../..//assets/ui_right_arrow.png')} className='right' />
          </a>
        </div>
      </div>
    );
  }
}

class VisitorUpgrade extends React.Component<accountProps, {}, {}> {
  public refs: {
    account: HTMLInputElement;
    pass1: HTMLInputElement;
    pass2: HTMLInputElement;
  };

  render() {
    return (
      <div className='change-pass'>
        <div className='item-pass'>
          <div className='ui_account'></div>
          <input
            ref='account'
            type='text'
            placeholder='Please enter your username'
            onBlur={() => {
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            }}
          />
        </div>
        <div className='item-pass'>
          <div className='ui_password'></div>
          <input
            ref='pass1'
            type='password'
            placeholder='Please enter your new password(6-20)'
            onBlur={() => {
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            }}
          />
        </div>
        <div className='item-pass'>
          <div className='ui_password'></div>
          <input
            ref='pass2'
            type='password'
            placeholder='Please enter your new password'
            onBlur={() => {
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            }}
          />
        </div>
        <button
          className='btn-change'
          onClick={() => {
            var account = this.refs.account.value;
            var pass1 = this.refs.pass1.value;
            var pass2 = this.refs.pass2.value;
            if (pass1 !== pass2) {
              Ins.showNotice(RG.jssdk.config.i18n.errMsg001);
            } else {
              var password = md5(pass1);
              RG.jssdk.bindVisitor(account, password).then(res => {
                if (res.code === 200) {
                  // var user = RG.CurUserInfo();

                  // user.password = password;
                  // user.userName = account;
                  // user.userType = 1;
                  // RG.jssdk.Account.user = user;

                  Ins.showNotice(RG.jssdk.config.i18n.msg001);
                  Ins.showHover(false);
                  Ins.hideAccount();
                } else if (res.code === 107) {
                  // 账号或者密码错误
                  Ins.showNotice(RG.jssdk.config.i18n.code102);
                } else if (res.code === 108) {
                  // 账号已经存在
                  Ins.showNotice(RG.jssdk.config.i18n.code101);
                } else {
                  Ins.showNotice(res.error_msg);
                }
              });
            }
          }}
        >
          {RG.jssdk.config.i18n.float_button_bind_account}
        </button>
      </div>
    );
  }
}

class Changepass extends React.Component<accountProps, {}, {}> {
  public refs: {
    oldpass: HTMLInputElement;
    pass1: HTMLInputElement;
    pass2: HTMLInputElement;
  };

  render() {
    return (
      <div className='change-pass'>
        <div className='item-pass'>
          <div className='ui_setting'></div>
          <input
            ref='oldpass'
            type='password'
            placeholder='Please enter your current password'
            onBlur={() => {
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            }}
          />
        </div>
        <div className='item-pass'>
          <div className='ui_password'></div>
          <input
            ref='pass1'
            type='password'
            placeholder='Please enter your new password(6-20)'
            onBlur={() => {
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            }}
          />
        </div>
        <div className='item-pass'>
          <div className='ui_password'></div>
          <input
            ref='pass2'
            type='password'
            placeholder='Please enter your new password'
            onBlur={() => {
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            }}
          />
        </div>
        <button
          className='btn-change'
          onClick={() => {
            var old = this.refs.oldpass.value;
            var pass1 = this.refs.pass1.value;
            var pass2 = this.refs.pass2.value;
            if (pass1 !== pass2) {
              Ins.showNotice(RG.jssdk.config.i18n.errMsg001);
            } else if (!old || !pass1) {
              Ins.showNotice(RG.jssdk.config.i18n.dom002);
            } else {
              var oldpass = md5(old);
              var password = md5(pass1);
              RG.jssdk.changePassword(oldpass, password).then(res => {
                if (res.code === 200) {
                  // var user = RG.CurUserInfo();
                  // user.password = password;
                  // RG.jssdk.Account.user = user;
                  Ins.showNotice(RG.jssdk.config.i18n.msg001);
                  Ins.hideAccount();
                } else if (res.code === 107) {
                  Ins.showNotice(RG.jssdk.config.i18n.code102);
                } else {
                  Ins.showNotice(res.error_msg);
                }
              });
            }
          }}
        >
          {RG.jssdk.config.i18n.txt_change_psw}
        </button>
      </div>
    );
  }
}

class PaymentHistory extends React.Component<accountProps, {}, {}> {
  constructor(props) {
    super(props);
    this.state.list = props.history.location.state.data.data;
  }

  state = {
    list: []
  };

  render() {
    console.log(this.state.list);
    if (this.state.list.length) {
      return (
        <div className='order-list'>
          {this.state.list.map((node, index) => (
            <div className='order' key={index}>
              <div className='order-line'>
                <p className='order-blue'>{RG.jssdk.config.i18n.txt_charge_num_tips}</p>
                <p>{node.amount + ' ' + node.currency}</p>
              </div>
              <div className='order-line'>
                <p className='order-blue'>{RG.jssdk.config.i18n.txt_charge_way_tips}</p>
                <p>
                  {node.channel === 1 || node.channel === 0
                    ? RG.jssdk.config.i18n.txt_official
                    : RG.jssdk.config.i18n.txt_other_way}
                </p>
              </div>
              <div className='order-line'>
                <p className='order-blue'>{RG.jssdk.config.i18n.txt_order_num_tips}</p>
                <p>{node.transactionId}</p>
              </div>
              <div className='order-line order-result'>
                <p className='order-red'>{RG.jssdk.config.i18n.txt_charge_status_tips}</p>
                <p>
                  {node.status == 200
                    ? RG.jssdk.config.i18n.msg001
                    : RG.jssdk.config.i18n.net_error_203}
                </p>
                <p className='order-time'>{node.clientDate}</p>
              </div>
              <div className={node.status == 200 ? 'order-status' : 'order-status red'}></div>
            </div>
          ))}
        </div>
      );
    } else {
      return null;
    }
  }
}

const Header = (props: accountProps) => {
  return (
    <div className='info-header'>
      <a
        style={{
          visibility: props.match.params.curPath === 'main' ? 'hidden' : 'visible'
        }}
        onClick={props.history.goBack}
        className='back'
      ></a>
      <h2>{RG.jssdk.config.i18n.float_button_user_center}</h2>
      <a onClick={Ins.hideAccount} className='close'></a>
    </div>
  );
};

export default class Account extends React.Component<
  {
    history: History;
  },
  {},
  any
> {
  render() {
    var app = Ins;
    return (
      <div className='userInfo'>
        <div className='wrap'></div>
        <div className='wrap-info'>
          <Route
            path='/:curPath'
            render={({match, history}) => {
              return <Header match={match} history={history} />;
            }}
          />
          <div className='info-content'>
            <Switch>
              <Route
                path='/payment-history'
                render={({history}) => <PaymentHistory history={history} />}
              />
              <Route path='/change-password' render={() => <Changepass />} />
              <Route path='/visitor-upgrade' render={() => <VisitorUpgrade />} />
              <Route path='/main' render={({history}) => <Main history={history} />} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}
