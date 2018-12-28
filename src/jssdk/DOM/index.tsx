import './base.scss'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from "DOM/App"

var root = document.createElement('div')
root.id = "RG-SDK"
root.style.zIndex = "999999999"
document.body.appendChild(root)
ReactDOM.render(<App />, root);

const Ins = App.instance

export {
  Ins
}







