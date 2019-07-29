
import './Type3.scss'
import * as React from 'react'
import Payment from 'DOM/components/payment'
import { History, createLocation } from 'history'

type paymentProps = {
  Payment: Payment
}

export default class Type3 extends React.Component<paymentProps, {}, any>  {

  private index = 3

  render() {
    var source = this.props.Payment.state.paymentDatas[this.index]
    // source
    // debugger
    return <div className="payment-nav type-3">
      <h2 className="name">
        {source.name}
      </h2>
      <ul className="type3-item">
        <div className="type3-product-content">
          <div className="type3-product-top">
            <div className="type3-product-img-wrap">
              <img className="type3-product-img" src={source.codeImg.replace(/http\:\/{0,2}/, 'https://').replace(/:[0-9]+/, '')} />
            </div>
            <div className="type3-product-desc" dangerouslySetInnerHTML={{ __html: source.selectedProduct.productDesc }}></div>
          </div>
          <div className="type3-product-center">
            <div className="type3-product-price"> {source.selectedProduct.shortCurrency + ' ' + source.selectedProduct.amount}</div>
            <div className="type3-buy-btn"
              onClick={() => {
                if (source.showMethod === 10 || source.showMethod === 11) {
                  let pageName: string;
                  if (source.showMethod === 10) {
                    pageName = "type1";
                    this.props.Payment.state.paymentDatas[1] = source;
                  };
                  if (source.showMethod === 11) {
                    pageName = "type2";
                    this.props.Payment.state.paymentDatas[2] = source;
                  };

                  this.props.Payment.props.history.push(
                    createLocation(pageName)
                  )
                } else {
                  RG.jssdk.Ordering(source).then((OrderRes: OrderRes) => {
                    if (OrderRes.code === 200) {
                      if (source.showMethod === 9) {
                        this.props.Payment.orderCompleted(OrderRes, source)
                      }
                    } else {
                      console.error(OrderRes.error_msg)
                    }
                  })
                }
              }}
            >
              {RG.jssdk.config.i18n.Purchase}
            </div>
          </div>
        </div>

        <div className="type3-product-down">
          {source.description}
        </div>
      </ul>
    </div>
  }

}

