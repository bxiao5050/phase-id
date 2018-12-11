
import './Type4.scss'
import * as React from 'react'
import Payment from 'Src/DOM/components/payment'
import { createLocation } from 'history'


type paymentProps = {
  Payment: Payment
}


export default class Type4 extends React.Component<paymentProps, {}, any>  {

  private index = 4

  render() {
    return <div className="payment-nav">
      <h2 className="name">
        {this.props.Payment.state.paymentDatas[this.index].name}
      </h2>
      <ul className="cards">
        {
          this.props.Payment.state.paymentDatas[this.index].nodes.map((node, i) => (
            <li key={i} data-id={i}
              onClick={() => {
                SDK.Ordering(node).then((OrderRes: OrderRes) => {
                  if (OrderRes.code === 200) {
                    this.props.Payment.state.paymentDatas[0] = OrderRes.data.returnInfo
                    this.props.Payment.props.history.push(createLocation('/type0'))
                  } else {
                    console.error(OrderRes.error_msg)
                  }
                })
              }}>
              <img src={node.codeImg} />
            </li>
          ))
        }
      </ul>
    </div>
  }

}