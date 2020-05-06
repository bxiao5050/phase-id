import * as React from 'react';
import Payment from './index';
import {replaceUrlToHttps} from 'Src/jssdk/utils';
// import {createLocation} from 'history';

type paymentProps = {
  Payment: Payment;
};

export default class Type4 extends React.Component<paymentProps, {}, any> {
  private index = 4;

  render() {
    return (
      <div>
        <h2 className='rg-pay-name'>{this.props.Payment.state.paymentDatas[this.index].name}</h2>
        <ul className='rg-cards'>
          {this.props.Payment.state.paymentDatas[this.index].nodes.map((node, i) => (
            <li
              className="rg-card"
              key={i}
              data-id={i}
              onClick={() => {
                this.props.Payment.intoPay(
                  this.props.Payment.state.paymentDatas[this.index].nodes[i]
                );
              }}
            >
              <img className="rg-card-img" src={replaceUrlToHttps(node.codeImg)} />
              <p className="rg-card-name">{node.name}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
