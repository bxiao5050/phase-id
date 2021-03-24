import React, {Fragment} from 'react';
import APP from '../../App';
interface IState {
  title: string;
  content: string;
  isShow: boolean;
  isTip: boolean;
  isRegister: boolean;
}
class BindPannel extends React.Component<{}, IState> {
  state = {
    title: '',
    content: '',
    isShow: false,
    isTip: true,
    isRegister: false
  };
  resolve: (value: boolean) => void;
  /* 返回promise */
  showConfirm(title: string, content: string, isTip: boolean, isRegister: boolean = false) {
    this.setState({title, content, isShow: true, isTip, isRegister});
    return new Promise<boolean>(resolve => {
      this.resolve = resolve;
    });
  }
  close = (isconfirm: boolean) => {
    this.setState({
      title: '',
      content: '',
      isShow: false
    });
    this.resolve(isconfirm);
  };
  openGiftUrl() {
    window.open(RG.jssdk.config.bindVisitorGiftUrl);
  }
  render() {
    const i18n = RG.jssdk.config.i18n;
    const {title, content, isShow, isTip, isRegister} = this.state;
    return (
      <Fragment>
        {isShow ? <div className='rg-mark'></div> : null}
        <div
          className={isShow ? 'rg-bindTip-wrap rg-center-f' : 'rg-bindTip-wrap rg-center-f rg-hide'}
        >
          <div className='rg-bindTip-title'>{title}</div>
          <p className={isTip ? 'rg-bindTip-msg' : 'rg-bindTip-msg rg-msg-brown'}>{content}</p>
          {isTip ? (
            <div className='rg-bindTip-btns'>
              <span
                className='rg-bindTip-visitor-btn'
                onClick={() => {
                  if (isRegister) {
                    APP.instance.copyUserInfo();
                  } else {
                    this.close(true);
                  }
                }}
              >
                {i18n.toBindTxt}
              </span>

              <span
                className={'rg-bindTip-next-btn'}
                onClick={() => {
                  this.close(false);
                }}
              >
                {i18n.nextTipTxt}
              </span>
            </div>
          ) : (
            <div className='rg-bindTip-btns'>
              <span
                className='rg-copy-btn'
                onClick={() => {
                  APP.instance.copyUserInfo();
                }}
              >
                {i18n.copyBtnTxt}
              </span>

              <span className={'rg-gift-btn'} onClick={this.openGiftUrl}>
                {i18n.toGetGiftTxt}
              </span>

              <span
                className={'rg-continue-btn'}
                onClick={() => {
                  this.close(false);
                }}
              >
                {i18n.continueTxt}
              </span>
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}
export default BindPannel;
