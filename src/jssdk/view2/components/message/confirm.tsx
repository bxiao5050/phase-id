import * as React from 'react';

interface IState{
  title: string,
  content: string,
  isShow: boolean,
  isAlert: boolean
}
class Confirm extends React.Component<{hideMark: () => void}, IState> {
  state = {
    title: '',
    content: '',
    isShow: false,
    isAlert: false
  };
  resolve: (value: boolean) => void;
  /* 返回promise */
  showConfirm(title: string, content: string, isAlert: boolean) {
    this.setState({title, content, isShow: true, isAlert});
    return new Promise<boolean>(resolve => {
      this.resolve = resolve;
    });
  }
  close = (isconfirm: boolean) => {
    this.setState({
      title: '',
      content: '',
      isShow: false,
      isAlert: false
    });
    this.props.hideMark();
    this.resolve(isconfirm);
  };
  render() {
    const i18n = RG.jssdk.config.i18n;
    const {title, content, isShow, isAlert} = this.state;
    return (
      <div className={isShow ? 'confirm' : 'confirm hide'}>
        <div className='confirm-title'>{title}</div>
        <p className='confirm-msg'>{content}</p>
        <div className='confirm-btns'>
          {!isAlert ? (
            <span
              className='confirm-cancle-btn'
              onClick={() => {
                this.close(false);
              }}
            >
              {i18n.txt_cancel}
            </span>
          ) : null}

          <span
            className={isAlert ? 'alert-close-btn' : 'confirm-ok-btn'}
            onClick={() => {
              this.close(true);
            }}
          >
            {i18n.txt_confirm}
          </span>
        </div>
      </div>
    );
  }
}
export default Confirm;
