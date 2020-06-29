import * as React from 'react';
import {Ins} from '../../index';

/* 类型 */
import {RouteComponentProps} from 'react-router-dom';
import {GetPaymentHistoryRes} from 'Src/jssdk/api/payment';

export default class PaymentHistory extends React.Component<
  RouteComponentProps,
  {list: GetPaymentHistoryRes['data']},
  {}
> {
  state = {
    list: []
  };
  async componentDidMount() {
    await RG.jssdk
      .getPaymentHistoryList()
      .then(res => {
        this.setState({list: res.data});
      })
      .catch(err => {
        Ins.showNotice(RG.jssdk.config.i18n.net_error_0);
        console.log(err);
      });
    /*  this.setState({
      list: [
        {
          transactionId: 'V4_10062_DS123321',
          amount: '10000',
          currency: 'VND',
          channel: 1,
          status: 200,
          chargingType: 1,
          clientDate: '2019-12-05 17:14:16'
        },
        {
          transactionId: 'V4_10062_DS123321',
          amount: '10000',
          currency: 'VND',
          channel: 0,
          status: 200,
          chargingType: 1,
          clientDate: '2019-12-05 17:14:16'
        },
        {
          transactionId: 'V4_10062_DS123321',
          amount: '10000',
          currency: 'VND',
          channel: 0,
          status: 200,
          chargingType: 1,
          clientDate: '2019-12-05 17:14:16'
        },
        {
          transactionId: 'V4_10062_DS123321',
          amount: '10000',
          currency: 'VND',
          channel: 0,
          status: 206,
          chargingType: 1,
          clientDate: '2019-12-05 17:14:16'
        },
        {
          transactionId: 'V4_10062_DS123321',
          amount: '10000',
          currency: 'VND',
          channel: 2,
          status: 400,
          chargingType: 3,
          clientDate: '2019-12-05 17:14:16'
        }
      ]
    }); */
  }
  render() {
    const i18n = RG.jssdk.config.i18n;
    return (
      <div className='rg-login-main rg-account rg-center-a'>
        <div className='rg-login-header'>
          {i18n.txt_recharge_history}
          <span
            className='rg-icon-close'
            onClick={() => {
              this.props.history.goBack();
            }}
          ></span>
        </div>
        <div className='rg-order-list-wrap'>
          {this.state.list.length === 0 ? <div className="rg-no-orderlist">{i18n.p2refresh_end_no_records}</div> : null}
          <ul className='rg-order-list'>
            {this.state.list.map((node, index) => (
              <li
                className={
                  node.status === 200
                    ? 'rg-order rg-order-icon-success'
                    : node.status === 206
                    ? 'rg-order rg-order-icon-pedding'
                    : 'rg-order rg-order-icon-failed'
                }
                key={'history' + index}
              >
                <div className='rg-order-line rg-order-money'>
                  <span className='rg-order-label'>{i18n.txt_charge_num_tips}</span>
                  {node.amount + ' ' + node.currency}
                </div>
                <div className='rg-order-line rg-order-way'>
                  <span className='rg-order-label'>{i18n.txt_charge_way_tips}</span>
                  {node.channel === 0 || node.channel === 1
                    ? i18n.txt_official
                    : i18n.txt_other_way}
                </div>
                <div className='rg-order-line rg-order-num'>
                  <span className='rg-order-label'>{i18n.txt_order_num_tips}</span>
                  {node.transactionId}
                </div>
                <div className='rg-order-line rg-order-status'>
                  <span className='rg-order-label'>{i18n.txt_charge_status_tips}</span>
                  {node.status === 200
                    ? i18n.txt_pay_success
                    : node.status === 206
                    ? i18n.txt_pay_pending
                    : i18n.txt_pay_fail}
                </div>
                <div className='rg-order-time'>{node.clientDate}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
