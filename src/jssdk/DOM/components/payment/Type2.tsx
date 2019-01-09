import "./Type2.scss";
import * as React from "react";
import Payment from "DOM/components/payment";
import { Ins } from "DOM/index";

type paymentProps = {
  Payment: Payment;
};
export default class Type2 extends React.Component<paymentProps, {}, any> {
  setInterval = undefined;
  state = {
    isQuerying: false,
    isQueryingTxt: ".",
    isShowExchangeRate: false
  };

  setState(state) {
    if (state.hasOwnProperty("isQuerying")) {
      if (state.isQuerying === true) {
        if (this.setInterval === undefined) {
          var isQueryingTxt = this.state.isQueryingTxt;
          this.setInterval = setInterval(() => {
            isQueryingTxt += ".";
            if (isQueryingTxt.length === 4) isQueryingTxt = ".";
            super.setState({
              isQueryingTxt: isQueryingTxt
            });
          }, 750);
        }
      } else {
        if (this.setInterval) {
          state.isQueryingTxt = ".";
          clearInterval(this.setInterval);
          this.setInterval = undefined;
        }
      }
    }
    super.setState(state);
  }

  private index = 2;

  public refs: {
    pin: HTMLInputElement;
  };

  pay = () => {
    var source = this.props.Payment.state.paymentDatas[this.index];
    source.exInfo = JSON.stringify({
      serialNo: "",
      pin: this.refs.pin.value
    });

    RG.jssdk.Ordering(source).then((orderRes: OrderRes) => {
      Ins.showNotice(orderRes.error_msg);

      this.state.isQuerying = false;
      this.setState(this.state);

      Ins.hidePayment();
    });
    this.state.isQuerying = true;
    this.setState(this.state);
  };

  render() {
    var source = this.props.Payment.state.paymentDatas[this.index];

    var isShowExchangeRate = this.state.isShowExchangeRate;
    return (
      <div className="Type2 payment-nav">
        <h2 className="name">
          {source.name}
          {source.products && source.products[0] ? (
            <span
              className="exchange"
              onClick={() => {
                this.state.isShowExchangeRate = true;
                this.setState(this.state);
              }}
            >
              Exchange rate
            </span>
          ) : null}
        </h2>

        <img className="card-head" src={source.codeImg} />

        <div className="card-inputs PIN" id="pin">
          <span>PIN: </span>
          <input placeholder="Please enter PIN" ref="pin" />
        </div>
        {this.state.isQuerying ? (
          <a href="javascript:void(0);" className="btn-pay">
            {RG.jssdk.config.i18n.loading} {this.state.isQueryingTxt}
          </a>
        ) : (
          <a href="javascript:void(0);" className="btn-pay" onClick={this.pay}>
            {RG.jssdk.config.i18n.PayCenter}
          </a>
        )}
        {isShowExchangeRate ? <div className="exchange-wrap" /> : null}
        {isShowExchangeRate ? (
          <div className="exchange-rate-list">
            <h2 className="exchange-name">
              Exchange rate
              <a
                className="close"
                onClick={() => {
                  this.state.isShowExchangeRate = false;
                  this.setState(this.state);
                }}
              />
            </h2>

            <ul className="exchange-list">
              {source.products.map((product, i) => (
                <li key={i} data-id={i}>
                  <div className="item-price">
                    {product.amount + " " + product.currency}
                  </div>
                  =
                  <div className="item-goods">
                    {product.gameCoin + " " + product.gameCurrency}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }
}
