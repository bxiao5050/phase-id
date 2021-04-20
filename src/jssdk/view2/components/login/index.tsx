import * as React from 'react';
import {Switch, Route, RouteComponentProps} from 'react-router-dom';

import Main from './main';
import Loading from './loading';
import LoginBox from './login';
import Register from './register';
import ForgetPassword from './forget';

export default class Login extends React.Component<
  {history: RouteComponentProps<{}, {}, {}>['history']},
  any
> {
  loginComplete = () => {
    this.props.history.push('/loading');
  };

  render() {
    return (
      <Switch>
        <Route exact path='/main' component={Main} />
        <Route exact path={'/register'} component={Register} />
        <Route exact path={'/loading'} component={Loading} />
        <Route exact path={'/login'} component={LoginBox} />
        <Route exact path={'/forget'} component={ForgetPassword} />
      </Switch>
    );
  }
}