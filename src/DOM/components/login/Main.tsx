import "./Main.scss"

import * as React from 'react'
import { Route } from 'react-router-dom'
import { createLocation } from 'history'
import Login from "Src/DOM/components/login"
import Choose from "Src/DOM/components/login/Choose"
import App from 'Src/DOM'

export default class Main extends React.Component<{
  Login: Login
  App: App
}, {}, any> {

  constructor(props) {
    super(props)
  }

  public refs: {
    choose: Choose
  }

  toLogin = async (isGuest) => {
    var loginParam: LoginParam
    var password
    if (isGuest) {
      password = Math.floor(Math.random() * Math.pow(10, 8)) + '';
      var userName = ""
      loginParam = {
        password,
        userName
      }
    } else {
      loginParam = {
        isFacebook: true
      }
    }
    await SDK.Login(loginParam)
    this.props.Login.loginComplete()
  }

  state = {
    users: SDK.GetUsers()
  }

  render() {
    return <div className={"content win-login win-choose"}>
      <h2 className="logo block">POCKET GAMES</h2>
      <div className="wrapper">

        <Route exact path="/main" render={() => {
          if (Object.keys(this.state.users).length) {
            return <Choose ref="choose" Login={this.props.Login} App={this.props.App} />
          } else {
            return <a className="btn-guest" onClick={this.toLogin.bind(this, true)}>
              &gt;&gt;&gt; {SDK.config.i18n.dom008} &lt;&lt;&lt;
            </a>
          }
        }} />

        <a className="btn-fb" onClick={() => {
          if (SDK['fbSdkIsLoaded']) {
            App.instance.showNotice('facebook 登錄跳轉中')
            // this.toLogin.bind(this, false)
            this.toLogin.apply(this, [false])
          } else {
            App.instance.showNotice('facebook sdk 加載異常。')
          }
        }}>
          <span className="icon-fb " />
          <span>&nbsp;{SDK.config.i18n.dom005} Facebook</span>
        </a>
      </div>
      <div className="line">
        <div className="line-left"></div>
        <div className="line-right"></div>
      </div>
      <div className="box">
        <a className="btn-login" onClick={() => {
          this.props.Login.props.history.push(
            createLocation('/entry')
          )
        }}
        >
          <span className="icon-login" />
          <span className="name">{SDK.config.i18n.dom005}</span>
        </a>
        <div className="line-bot" />
        <a className="btn-register" onClick={() => {
          this.props.Login.props.history.push(
            createLocation('/register')
          )
        }}>
          <span className="icon icon-register" />
          <span className="name">{SDK.config.i18n.dom004}</span>
        </a>
      </div>
    </div>
  }
}