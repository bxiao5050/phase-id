import './Register.scss'
import * as React from 'react'
import Login from 'DOM/components/login'
import App from 'DOM/index'

type RegisterProp = {
  Login: Login
  App: App
}

export default class Register extends React.Component<RegisterProp, {}, any>  {

  constructor(props: RegisterProp) {
    super(props)
  }

  state = {
    userName: '',
    password1: '',
    password2: '',
    closeUser: false,
    showPass: false,
    closePass1: false,
    closePass2: false,
  }

  register = async () => {
    var { password1, password2, userName } = this.state
    if (!password1 || !password2 || !userName) {
      return
    }
    if (password1 != password2) {
      this.props.App.showNotice(SDK.config.i18n.errMsg001);
    } else if (password1.length < 6 || password1.length > 20) {
      this.props.App.showNotice(SDK.config.i18n.errMsg002);
    } else {
      var password = password1
      try {
        await SDK.Login({
          isReg: true,
          password,
          userName,
          accountType: 1,
          thirdPartyId: '',
          email: '',
          telephone: '',
          userChannel: 0,
          exInfo: ''
        })
        this.props.Login.loginComplete()
      } catch (err) {
        this.props.App.showNotice(err)
      }
    }
  }

  onChange = (e) => {
    switch (e.target.id) {
      case "userName":
        var userName = e.target.value;
        this.setState({
          userName: userName,
          closeUser: (userName.length > 0)
        });
        break;
      case "password1":
        var password1 = e.target.value;
        this.setState({
          password1: password1,
          closePass1: (password1.length > 0)
        });
        break;
      case "password2":
        var password2 = e.target.value;
        this.setState({
          password2: password2,
          closePass2: (password2.length > 0)
        });
        break;
      default:
        break;
    }
  }

  clearUser = () => {
    this.setState({
      userName: '',
      closeUser: false
    });
  }

  clearPass1 = () => {
    this.setState({
      password1: '',
      closePass1: false
    });
  }

  clearPass2 = () => {
    this.setState({
      password2: '',
      closePass2: false
    });
  }

  changeType = () => {
    var temp = !this.state.showPass;
    this.setState({
      showPass: temp
    })
  }

  blurInput = (id) => {
    setTimeout(() => {
      switch (id) {
        case "userName":
          this.setState({
            closeUser: false
          });
          break;
        case "password1":
          this.setState({
            closePass1: false
          });
          break;
        case "password2":
          this.setState({
            closePass2: false
          });
          break;
        default:
          break;
      }
    }, 100)
  }

  focusInput = (id) => {
    if (id == "userName" && this.state.userName.length > 0) {
      this.setState({
        closeUser: true
      })
    } else if (id == "password1" && this.state.password1.length > 0) {
      this.setState({
        closePass1: true
      })
    } else if (id == "password2" && this.state.password2.length > 0) {
      this.setState({
        closePass2: true
      })
    }
  }

  render() {
    return <div className="content win-register">
      <div className="header">
        <div className="icon-head"></div>
        <a className="close" onClick={() => {
          this.props.Login.props.history.goBack()
        }}>
        </a>
      </div>
      <div className="box-input">
        <div className="line-input username"
          onBlur={() => this.blurInput("userName")}
          onFocus={() => this.focusInput("userName")}
        >
          <div className="icon"></div>
          <input type="text" placeholder={SDK.config.i18n.dom001}
            value={this.state.userName}
            onChange={(e) => this.onChange(e)}
            id="userName" />
          <div
            className={"icon-close "
              + (this.state.closeUser ? "active" : '')
            }
            onClick={this.clearUser}
          ></div>
        </div>
        <div className="line-input password one" >
          <div className="icon"></div>
          <input
            placeholder={SDK.config.i18n.dom002 + '(6-20)'}
            type={this.state.showPass ? "text" : "password"}

            value={this.state.password1} id="password1"
            onChange={(e) => this.onChange(e)}
            onBlur={() => this.blurInput("password1")} onFocus={() => this.focusInput("password1")}
          />
          <div
            className={"icon-close "
              + (this.state.closePass1 ? "active" : '')
            }
            onClick={() => this.clearPass1()}
          ></div>
        </div>
        <div className="line-input password" >
          <div className="icon"></div>
          <input
            placeholder={SDK.config.i18n.dom002}
            type={this.state.showPass ? "text" : "password"}
            value={this.state.password2}
            onChange={(e) => this.onChange(e)} id="password2"
            onBlur={() => this.blurInput("password2")} onFocus={() => this.focusInput("password2")}
          />
          <div
            className={"icon-close "
              + (this.state.closePass2 ? "active" : '')
            }
            onClick={() => this.clearPass2()}
          ></div>
        </div>
      </div>

      <div className="check"
        onClick={this.changeType}
      >
        <div
          className={"checkbox "
            + (this.state.showPass ? "active" : '')
          }
        ></div>
        <p>{SDK.config.i18n.dom009}</p>
      </div>
      <a className="btn-register"
        onClick={this.register}
      >{SDK.config.i18n.dom004}</a>
    </div>
  }

}