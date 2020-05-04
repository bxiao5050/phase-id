import * as React from 'react';
import {Switch, Route} from 'react-router-dom';
import PaymentHistory from './paymentHistory';
import ChangePassword from './changepassword';
import Visitor from './visitor';
import Email from './email';

import Main from './main';

export default class Account extends React.Component<{}, any> {
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
