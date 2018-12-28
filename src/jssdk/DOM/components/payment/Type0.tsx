
import './Type0.scss'
import * as React from 'react'
import Payment from 'DOM/components/payment'
import { History } from 'history'
import Utils from 'Src/Base/Utils';

type paymentProps = {
  Payment: Payment
  history?: History
}

export default class Type0 extends React.Component<paymentProps, {}, any>  {

  // componentDidMount() {
  //   if (this.props.history.location.state.from === 'mycard') {
  //     var ifram: HTMLIFrameElement = this.refs.iframe as any
  //     ifram.addEventListener("load", () => {
  //       this.state.mycardtip = 'flex'
  //       this.setState(this.state)
  //     })

  //     var observer = new IntersectionObserver(function (entries, observer) {
  //       console.log(entries, observer)
  //     });
  //     observer.observe(ifram)

  //   }
  // }

  // state = {
  //   mycardtip: 'none'
  // }

  componentDidMount() {
    if (Utils.getUrlParam('pay')) {
      console.log('发货请求中', this.props.Payment.state.paymentDatas[0])
      RG.jssdk.App.hidePayment()
    }
  }

  render() {
    var source = this.props.Payment.state.paymentDatas[0]
    var url = source.url

    return <div className="payment-nav Type0">
      <iframe ref="iframe" className="web" src={url}></iframe>
      {/* {this.state.mycardtip !== 'none' && <a className="my-card-tip" href={url} target="_blank"
        style={{
          position: 'absolute',
          right: '.4rem',
          height: '2.8rem',
          display: this.state.mycardtip,
          alignItems: 'center',
          fontSize: '.76rem',
          width: '12rem',
          justifyContent: 'center',
          top: '0',
        }}
      >
        如果支付頁面出錯，請點擊此處
      </a>} */}

    </div>
  }

}