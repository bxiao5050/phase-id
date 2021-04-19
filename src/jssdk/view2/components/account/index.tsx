import * as React from 'react';
import {Switch, Route, RouteComponentProps} from 'react-router-dom';
import PaymentHistory from './paymentHistory';
import ChangePassword from './changepassword';
/* 游客账号升级 */
import Visitor from './visitor';
/* 绑定安全邮箱 */
import Email from './email';
/* 用户中心面板 */
import Main from './main';

export default class Account extends React.Component<
  {history: RouteComponentProps<{}, {}, {}>['history']},
  {},
  any
> {
  componentDidMount() {
    if (RG.jssdk.account.user.userType === 0) {
      this.props.history.replace('/visitor');
    }
  }
  render() {
    return (
      <Switch>
        <Route exact path='/main' component={Main} />
        <Route exact path={'/visitor'} component={Visitor} />
        <Route exact path={'/email'} component={Email} />
        <Route exact path={'/change-password'} component={ChangePassword} />
        <Route exact path={'/history'} component={PaymentHistory} />
      </Switch>
    );
  }
}
