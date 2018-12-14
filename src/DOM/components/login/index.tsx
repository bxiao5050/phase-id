import './index.scss'
import * as React from 'react'
import { Switch, Route, MemoryRouter } from 'react-router-dom'
import { History, createLocation } from 'history'
import App from 'DOM/index'
import Main from 'DOM/components/login/Main'
import Loading from 'DOM/components/login/Loading'
import Entry from 'DOM/components/login/Entry'
import Register from 'DOM/components/login/Register'

export default class Login extends React.Component {

  public props: {
    App: App
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
        <Route exact path={'/register'} render={() => <Register App={this.props.App} Login={this} />} />
        <Route exact path={'/entry'} render={() => <Entry App={this.props.App} Login={this} />} />
        <Route exact path={'/loading'} render={() => <Loading App={this.props.App} Login={this} />} />
        <Route exact path="/main" render={() => <Main App={this.props.App} Login={this} />} />
      </Switch>
    </div>
  }

}