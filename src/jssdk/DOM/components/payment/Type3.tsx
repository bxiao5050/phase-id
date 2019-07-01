
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
        </div>

        <div className="type3-product-down">
          {source.description}
        </div>
      </ul>
    </div>
  }

}

// <ul className="item">

//         <div className="type3-product-desc">
//           <div className="type3-product-img">
//             <img src={source.codeImg.replace(/http\:\/{0,2}/, 'https://').replace(/:[0-9]+/, '')} />
//           </div>
//           <div className="right">
//             <div className="left" dangerouslySetInnerHTML={{ __html: source.selectedProduct.productDesc }}>
//               {/* {source.selectedProduct.productDesc} */}
//               {/* {source.selectedProduct.gameCurrency} *{source.selectedProduct.gameCoin} */}
//               </div>
//               <div className="right">
//                 {source.selectedProduct.shortCurrency + ' ' + source.selectedProduct.amount}
//               </div>
//               <div className="item-buy-btn"
//                 onClick={() => {
//                   RG.jssdk.Ordering(source).then((OrderRes: OrderRes) => {
//                     if (OrderRes.code !== 200) {
//                       console.error(OrderRes.error_msg)
//                     }
//                   })
//                 }}
//               >
//                 {RG.jssdk.config.i18n.Purchase}
//               </div>
//             </div>
//           </div>
//           <div className="type3-product-price">{}</div>
//           <div className="down">
//             <div className="left">
//               {source.description}
//             </div>
//           </div>
//         </ul>

