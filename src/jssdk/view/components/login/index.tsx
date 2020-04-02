import './index.scss'
import * as React from 'react'
import { Switch, Route, MemoryRouter } from 'react-router-dom'
import { History, createLocation } from 'history'
import Main from './Main'
import Loading from './Loading'
import Entry from './Entry'
import Register from './Register'

export default class Login extends React.Component {

  public props: {
    history: History
  }

  constructor(props) {
    super(props)
  }

  loginComplete = () => {
    this.props.history.push(createLocation(
      '/loading'
    ))
  }

  render() {
    return <div className="login">
      <div className="wrap">
      </div>
      <Switch>
        <Route exact path={'/register'} render={() => <Register Login={this} />} />
        <Route exact path={'/entry'} render={() => <Entry Login={this} />} />
        <Route exact path={'/loading'} render={() => <Loading Login={this} />} />
        <Route exact path="/main" render={() => <Main Login={this} />} />
      </Switch>
    </div>
  }

}
