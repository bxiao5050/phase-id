import './base.scss'

import * as React from 'react'
import * as ReactDom from 'react-dom'
import App from "Src/DOM/App";

var root = document.createElement('div')
root.id = "RG-SDK"
root.style.zIndex = "999999999"
document.body.appendChild(root)

ReactDom.render(<App />, root);

export default App