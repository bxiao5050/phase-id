import './Loading.scss'
import * as React from 'react'
import Login from 'DOM/components/login'
import { Ins } from 'DOM/index'
import Utils from 'Base/Utils'

type LoadingProp = {
  Login: Login
}

export default class Loading extends React.Component<LoadingProp, {}, any>  {

  constructor(props: LoadingProp) {
    super(props)
  }

  state = {
    clock: null
  }

  componentDidMount() {
    this.setState({
      clock: setTimeout(() => {
        var { userType, accountType } = RG.jssdk.Account.user
        Ins.hideLogin()
        if (location.host === window.$rg_main.Mark.game_url.host && location.pathname === window.$rg_main.Mark.game_url.pathname) {
          var isGuest = Utils.getAccountType(userType, accountType) === 'guest' ? true : false;
          Ins.showHover(isGuest)
        }
        window.rgAsyncInit && window.rgAsyncInit()
      }, 2000)
    })
  }

  unclock = () => {
    clearTimeout(this.state.clock)
  }

  componentWillUnmount() {
    this.unclock()
  }

  render() {
    var user: UserInfo = RG.jssdk.Account.user
    var password: string = user.password
    return <div className="content win-loading">
      <h2 className="logo block">IPOCKET GAMES</h2>
      <div className="info">
        <p>{RG.jssdk.config.i18n.txt_account_name}:  <span>{user.userName}</span></p>
        <p>{RG.jssdk.config.i18n.dom007}: <span>{(password ? password.substring(0, 10) : "") + '...'}</span></p>
      </div>
      <div className="loading">{RG.jssdk.config.i18n.dom005}</div>
      <div className="line"></div>
      <a className="change" onClick={() => {
        this.unclock();
        this.props.Login.props.history.goBack()
      }}>
        <span className="switch"></span>
        <span>{RG.jssdk.config.i18n.dom003}</span>
      </a>
    </div>
  }

}