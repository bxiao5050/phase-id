import * as React from 'react';
import {Ins} from '../..//index';
export default class WinOpen extends React.Component<any, any, any> {
  render() {
    const i18n = RG.jssdk.config.i18n;
    return (
      <div className='win-open'>
        <div className='cover'></div>
        <div className='box'>
          <div
            className='close'
            onClick={() => {
              this.props.parent.setState({
                winOpen: false
              });
            }}
          ></div>
          <div className='upper'>{i18n.winopen}</div>
          <div className='udder'>
            <div
              className='btn-jump'
              onClick={() => {
                const url = this.props.parent.state.url;
                window.open(url);
                this.props.parent.setState({
                  winOpen: false,
                  url: ''
                });
                Ins.hidePayment();
              }}
            >
              {i18n.jump}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
