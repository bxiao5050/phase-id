import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './base.scss'
import Notice from "./components/notice";

export class App extends React.Component {

  public refs: {
    notice: Notice
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
    noticeList: [],
  }
  showNotice = (msg: string) => {
    this.hasNotice++
    this.state.noticeList.push(msg)
    this.setState(this.state)
  }

  render() {
    return <div>
      {/* 提示模块 */}
      {this.state.noticeList.map((noticeMsg, index) => {
        return <Notice key={index} msg={noticeMsg} Ins={this} />
      })}
    </div>
  }
}

var root = document.createElement('div')
root.id = "RG-SDK"
root.style.zIndex = "9999"
root.style.fontFamily = 'Helvetica, Arial, "Microsoft YaHei", sans-serif;'
document.body.appendChild(root);
ReactDOM.render(<App />, root);

const Ins = App.instance

export {
  Ins
}
