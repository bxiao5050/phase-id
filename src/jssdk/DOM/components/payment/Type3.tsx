
import './Type3.scss'
import * as React from 'react'
import Payment from 'DOM/components/payment'


type paymentProps = {
  Payment: Payment
}


export default class Type3 extends React.Component<paymentProps, {}, any>  {

  private index = 3

  render() {
    var source = this.props.Payment.state.paymentDatas[this.index]
    return <div className="payment-nav type-3">
      <h2 className="name">
        {source.name}
      </h2>
      <ul className="item">

        <div className="up">
          <div className="left">
            <img src={source.code.replace(/http\:\/{0,2}/, 'https://').replace(/:[0-9]+/, '')} />
          </div>
          <div className="right">
            <div className="left">
              {source.selectedProduct.gameCurrency} *{source.selectedProduct.gameCoin}
            </div>
            <div className="right">
              {source.selectedProduct.shortCurrency + ' ' + source.selectedProduct.amount}
            </div>
          </div>
        </div>
        <div className="down">
          <div className="left">
            {source.description}
          </div>
          <div className="right"
            onClick={() => {
              RG.jssdk.Ordering(source).then((OrderRes: OrderRes) => {
                if (OrderRes.code !== 200) {
                  console.error(OrderRes.error_msg)
                }
              })
            }}
          >
            {RG.jssdk.config.i18n.Purchase}
          </div>
        </div>
      </ul>
    </div>
  }

}