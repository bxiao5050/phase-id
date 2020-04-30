import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import PaymentHistory from "./paymentHistory"

import Main from './main';

export default class Account extends React.Component<{}, any> {
  render() {
    return (
      <Switch>
        <Route exact path='/main' component={Main} />
        {/* <Route exact path={'/visitor'} component={Register} /> */}
        {/* <Route exact path={'/changepwd'} component={Loading} /> */}
        {/* <Route exact path={'/email'} component={LoginBox} />} /> */}
        <Route exact path={'/history'} component={PaymentHistory} />} />
      </Switch>
    );
  }
}
