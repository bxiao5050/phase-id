import './index.scss'
import * as React from 'react'
import App from 'DOM/index'

export default class Notice extends React.Component<{
  instance?: App
  msg?: string
}, {}, any> {

  state = {
    opacity: false
  }

  componentDidMount() {
    setTimeout(() => {
      this.state.opacity = true
      this.setState(this.state)
      setTimeout(() => {
        this.state.opacity = false
        this.setState(this.state)
        setTimeout(() => {
          App.instance.hasNotice--
          if (App.instance.hasNotice === 0) {
            App.instance.state.noticeList = []
            App.instance.setState(App.instance.state);
          }
        }, 1000)
      }, 2300)
    })
  }

  render() {
    return <div className={this.state.opacity ? 'box-alert show' : 'box-alert'}>
      <p>{this.props.msg}</p>
    </div>
  }

}

