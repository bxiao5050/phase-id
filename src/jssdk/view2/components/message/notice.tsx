import * as React from 'react';

interface IState {
  msg: string;
  isShow: boolean;
}
class Notice extends React.Component<{}, IState> {
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
    this.isAnimation = true
    const _alert = () => {
      if (this.noticeList.length === 0) {
        this.isAnimation = false;
        this.setState({isShow: false});
        return;
      }
      const msg = this.noticeList.shift();
      this.setState({msg});
      setTimeout(_alert, 3000);
    };
    _alert();
  };

  render() {
    const {isShow, msg} = this.state;
    return (
      <div className={isShow ? 'rg-notice' : 'rg-notice rg-hide'}>
        <p className="rg-notice-msg">{msg}</p>
      </div>
    );
  }
}
export default Notice;
