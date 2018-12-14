
import './Type1.scss'
import * as React from 'react'
import Payment from 'Src/DOM/components/payment'
import App from 'DOM/index'

type paymentProps = {
	Payment: Payment
}
export default class Type1 extends React.Component<paymentProps, {}, any> {

	setInterval = undefined
	state = {
		isQuerying: false,
		isQueryingTxt: '.'
	}

	setState(state) {
		if (state.hasOwnProperty('isQuerying')) {
			if (state.isQuerying === true) {
				if (this.setInterval === undefined) {
					var isQueryingTxt = this.state.isQueryingTxt
					this.setInterval = setInterval(() => {
						isQueryingTxt += '.'
						if (isQueryingTxt.length === 4) isQueryingTxt = '.';
						super.setState({
							isQueryingTxt: isQueryingTxt
						})
					}, 750)
				}
			} else {
				if (this.setInterval) {
					state.isQueryingTxt = '.'
					clearInterval(this.setInterval)
					this.setInterval = undefined
				}
			}
		}
		super.setState(state)
	}

	private index = 1

	public refs: {
		serial: HTMLInputElement
		pin: HTMLInputElement
	}

	pay = () => {
		var source = this.props.Payment.state.paymentDatas[this.index]
		source.exInfo = JSON.stringify({
			serialNo: this.refs.serial.value,
			pin: this.refs.pin.value,
		})

		SDK.Ordering(source)
			.then((orderRes: OrderRes) => {
				App.instance.showNotice(orderRes.error_msg)

				this.state.isQuerying = false
				this.setState(this.state)

				App.instance.hidePayment()
			})
		this.state.isQuerying = true
		this.setState(this.state)
	}

	render() {
		var source = this.props.Payment.state.paymentDatas[this.index]
		console.log(source)
		return (
			<div className="Type1 payment-nav">
				<h2 className="name">
					{source.name}
					<span className="exchange">Exchange rate</span>
				</h2>

				<img className="card-head" src={source.codeImg} />

				<div className="card-inputs Serial" id="serial">
					<span>Serial: </span>
					<input placeholder="Please enter Serial Number" ref="serial" />
				</div>
				<div className="card-inputs PIN" id="pin">
					<span>PIN: </span>
					<input placeholder="Please enter PIN" ref="pin" />
				</div>
				{this.state.isQuerying ? <a href="javascript:void(0);" className="btn-pay">Đang kiểm tra {this.state.isQueryingTxt}</a> : <a href="javascript:void(0);" className="btn-pay" onClick={this.pay}>Payment</a>}

			</div>
		)
	}
}


