import * as React from 'react'
import { Route, MemoryRouter } from 'react-router-dom'
import Notice from "DOM/components/notice";
import Hover from "DOM/components/hover";
import Account from "DOM/components/account";
import Login from "DOM/components/login";
import Payment from "DOM/components/payment"

class App extends React.Component {

  public refs: {
    notice: Notice
    hover: Hover
    loginRoute: any
  }

  constructor(props: any) {
    super(props)
    App._ins = this
  }

  private static _ins: App
  static get instance(): App {
    return this._ins
  }

  hasNotice = 0

  state = {
    showAccount: false,
    accountEntry: ['/main'],
    hasAccount: false,
    hoverIsGuest: false,
    noticeList: [],
    showLogin: false,
    showPayment: false,
    paymentConfig: null,
  }

  showAccount = () => {
    this.state.showAccount = true
    if (this.state.hoverIsGuest) {
      this.state.accountEntry = ['/visitor-upgrade']
    } else {
      this.state.accountEntry = ['/main']
    }
    this.setState(this.state)
  }

  hideAccount = () => {
    this.setState({
      showAccount: false
    })
  }

  showHover = (isGuest: boolean) => {
    this.setState({
      hasAccount: true,
      hoverIsGuest: isGuest
    })
  }

  showNotice = (msg: string) => {
    App.instance.hasNotice++
    this.state.noticeList.push(msg)
    this.setState(this.state)
  }

  showLogin = (): Login => {
    this.setState({
      showLogin: true
    })
    return this.refs.loginRoute.refs.login
  }

  hideLogin = () => {
    this.setState({
      showLogin: false
    })
  }

  showPayment = (paymentConfig: PaymentConfigRes) => {
    this.setState({
      showPayment: true,
      paymentConfig: paymentConfig
    })
  }

  hidePayment = () => {
    this.setState({
      showPayment: false
    })
  }

  render() {
    var defaultModule = ['/main']
    return <div>
      {/* 支付模块 */}
      {this.state.showPayment && <MemoryRouter initialEntries={defaultModule}>
        <Route render={({ history }) => <Payment App={this} history={history} />} />
      </MemoryRouter>}

      {/* 登录模块 */}
      {this.state.showLogin && <MemoryRouter initialEntries={defaultModule}>
        <Route ref="loginRoute" render={({ history }) => <Login ref="login" App={this} history={history} />} />
      </MemoryRouter>}

      {/* 账户管理中心 */}
      {this.state.showAccount && <MemoryRouter initialEntries={this.state.accountEntry}>
        <Route render={({ history }) => <Account App={this} history={history} />} />
      </MemoryRouter>}

      {/* 提示模块 */}
      {this.state.noticeList.map((noticeMsg, index) => {
        return <Notice key={index} instance={this} msg={noticeMsg} />
      })}

      {/* 悬浮球 */}
      {this.state.hasAccount && <Hover ref="hover" instance={this} isGuest={this.state.hoverIsGuest} />}
    </div>
  }
}

export default App