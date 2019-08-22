import './base.scss'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from "./App"

var root = document.createElement('div');
root.id = "RG-SDK"
root.style.zIndex = "9999"
root.style.fontFamily = 'Helvetica, Arial, "Microsoft YaHei", sans-serif;'
document.body.appendChild(root)
ReactDOM.render(<App />, root);

const Ins = App.instance

export {
  Ins
}







