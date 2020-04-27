import * as React from 'react';

import App from '../../App';
interface IState {
  msg: string;
  isShow: boolean;
}
class Notice extends React.Component<{hideMark: () => void}, IState> {
  state = {
    isShow: false,
    msg: ''
  };
  noticeList = [];
  isAnimation = false;
  addMsg = (msg: string) => {
    if (!msg) return;
    this.noticeList.push(msg);
    this.setState({ isShow: true });
    if(!this.isAnimation)this.showTip();
  };

  showTip = () => {
    const that = this;
    this.isAnimation = true
    function alert() {
      if (that.noticeList.length === 0) {
        that.isAnimation = true
        that.setState({isShow: false});
        that.props.hideMark();
        return;
      }
      const msg = that.noticeList.shift();
      that.setState({msg});
      setTimeout(alert, 3000);
    }
    alert();
  };

  render() {
    const {isShow, msg} = this.state;
    return (
      <div className={isShow ? 'rg-notice' : 'rg-notice hide'}>
        <p className="rg-notice-msg">{msg}</p>
      </div>
    );
  }
}
export default Notice;
