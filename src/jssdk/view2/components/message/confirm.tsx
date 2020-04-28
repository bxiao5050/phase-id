import React, {Fragment} from 'react';

interface IState {
  title: string;
  content: string;
  isShow: boolean;
  isAlert: boolean;
}
class Confirm extends React.Component<{}, IState> {
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
    this.resolve(isconfirm);
  };
  render() {
    const i18n = RG.jssdk.config.i18n;
    const {title, content, isShow, isAlert} = this.state;
    return (
      <Fragment>
        {isShow ? <div className='rg-mark'></div> : null}
        <div className={isShow ? 'rg-confirm rg-center-f' : 'rg-confirm rg-center-f rg-hide'}>
          <div className='rg-confirm-title'>{title}</div>
          <p className='rg-confirm-msg'>{content}</p>
          <div className='rg-confirm-btns'>
            {!isAlert ? (
              <span
                className='rg-confirm-cancle-btn'
                onClick={() => {
                  this.close(false);
                }}
              >
                {i18n.txt_cancel}
              </span>
            ) : null}

            <span
              className={isAlert ? 'rg-alert-close-btn' : 'rg-confirm-ok-btn'}
              onClick={() => {
                this.close(true);
              }}
            >
              {i18n.txt_confirm}
            </span>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default Confirm;
