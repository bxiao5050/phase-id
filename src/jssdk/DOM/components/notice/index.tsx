import './index.scss'
import * as React from 'react'
import { Ins } from 'DOM/index';

export default class Notice extends React.Component<{
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
        setTimeout(async () => {
          Ins.hasNotice--
          if (Ins.hasNotice === 0) {
            Ins.state.noticeList = []
            Ins.setState(Ins.state);
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

