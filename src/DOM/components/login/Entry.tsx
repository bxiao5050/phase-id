import './Entry.scss'
import * as React from 'react'
import { createLocation } from 'history'
import App from 'DOM/App'
import Login from "DOM/components/login"
import Choose from "DOM/components/login/Choose"

type EntryProp = {
  App: App
  Login: Login
}

export default class Entry extends React.Component<EntryProp, {}, any>  {

  public refs: {
    choose: Choose
  }

  constructor(props: EntryProp) {
    super(props)
  }

  render() {
    return <div className="content win-account">
      <div className="header">
        <div className="icon-head"></div>
      </div>
      <div className="wrapper">
        <Choose ref="choose" App={this.props.App} Login={this.props.Login} />
        <a className="btn-login"
          onClick={async () => {
            var { userName, password } = this.refs.choose.state
            if (!userName || !password) {
              return
            }
            var password: string = password
            try {
              await SDK.Login({
                userName,
                password
              })
              this.props.Login.loginComplete()
            } catch (err) {
              this.props.App.showNotice(err)
            }
          }}
        >{SDK.config.i18n.dom005}</a>
        <div className="box-link">
          <a onClick={() => {
            this.props.Login.props.history.goBack()
          }} className="link-change">&lt;&lt; {SDK.config.i18n.dom003}</a>
          <a onClick={() => {
            this.props.Login.props.history.push(
              createLocation('/register')
            )
          }} className="link-register">{SDK.config.i18n.dom004} &gt;&gt;</a>
        </div>
      </div>

    </div>
  }

}