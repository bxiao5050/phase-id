
import './Type5.scss'
import * as React from 'react'
import Payment from 'DOM/components/payment'
import { createLocation } from 'history'


type paymentProps = {
  Payment: Payment
}


export default class Type5 extends React.Component<paymentProps, {}, any>  {

  private index = 5

  state = {
    selectedProduct: this.props.Payment.state.paymentDatas[5].products[0]
  }

  change = (value) => {
    this.setState({
      selectedProduct: this.props.Payment.state.paymentDatas[5].products[value * 1]
    })
  }

  pay = () => {
    RG.jssdk.Ordering(this.props.Payment.state.paymentDatas[this.index]).then((OrderRes: OrderRes) => {
      if (OrderRes.code === 200) {
        this.props.Payment.state.paymentDatas[0] = OrderRes.data.returnInfo
        this.props.Payment.props.history.push(
          createLocation('type0')
        )
      } else {
        console.error(OrderRes.error_msg)
      }
    })
  }


  render() {
    return <div className="payment-nav">
      <h2 className="name">
        {this.props.Payment.state.paymentDatas[this.index].name}
      </h2>
      <div className="product">
        <p className="tip">Sản phẩm</p>
        <select className="productions"
          onChange={(e) => { this.change(e.target.value) }}
        >
          {
            this.props.Payment.state.paymentDatas[this.index].products.map((key, index) => (
              <option key={index} value={index}>{key.gameCoin + key.gameCurrency}</option>
            ))
          }
        </select>
        <a href="javascript:void(0);" className="icon-down">
        </a>
      </div>
      <div className="result">
        <span>Cần trả: </span>
        <p>
          {this.state.selectedProduct.shortCurrency + ' ' + this.state.selectedProduct.amount}
        </p>
      </div>
      <a href="javascript:void(0);" className="buy-goods"
        onClick={this.pay}
      >Mua KNB</a>
    </div>
  }

}