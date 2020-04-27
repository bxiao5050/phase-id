import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './assets/scss/index.scss';

var root = document.createElement('div');
root.id = 'RG-SDK';
document.body.appendChild(root);
ReactDOM.render(<App />, root);

const Ins = App.instance;

/* 注册第三方支付成功关闭支付界面事件 */
window.addEventListener('message', function (event) {
  if (event.data === 'rgclose') Ins.hidePayment();
});

export {Ins};
