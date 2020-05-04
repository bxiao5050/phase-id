import * as React from 'react';

import {Ins} from '../../index';
/* 导入类型 */
import {RouteComponentProps} from 'react-router-dom';

export default class Main extends React.Component<RouteComponentProps, {}> {
  state = {};
  render() {
    const i18n = RG.jssdk.config.i18n;
    const history = this.props.history;
    return (
      <div className='rg-login-main rg-payment rg-center-a'>
        <div className='rg-login-header'>
          {i18n.txt_title_user_center}
          <span
            className='rg-icon-close'
            onClick={() => {
              Ins.toggleAccount(false);
            }}
          ></span>
        </div>
        <div className='rg-payment-content'></div>
      </div>
    );
  }
}
