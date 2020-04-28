import * as React from 'react';
import {Switch, Route} from 'react-router-dom';
import {History, createLocation} from 'history';
import Main from './main';
import Loading from './loading';
import LoginBox from './login';
import App from '../../App';
// import Register from 'register';

export default class Login extends React.Component<{history: History,Ins:App}, any> {

  loginComplete = () => {
    this.props.history.push(createLocation('/loading'));
  };

  render() {
    return (
      // <div className='login-wrap'>
      <Switch>
        {/* <Route exact path={'/register'} render={() => <Register Login={this} />} /> */}
        <Route exact path={'/loading'} component={Loading} />
        <Route exact path={'/login'} component={LoginBox} />} />
        <Route exact path='/main' component={Main} />
      </Switch>
      // </div>
    );
  }
}
