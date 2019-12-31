import './index.scss'
import * as React from 'react'
import { History } from 'history'
import { Ins } from 'DOM/index'

var canTouch = false
var isMoving = false

export default class Hover extends React.Component<{
  history?: History
  isGuest: boolean
}, {}, any> {

  public refs: {
    hover: HTMLElement
    floatBall: HTMLElement
  }

  constructor(props) {
    super(props)
  }

  initialPositionLeft = RG.jssdk.config.hoverFromLeft

  state = {
    flag: false,
    x: 0,
    y: 0,
    positionFromLeft: this.initialPositionLeft
  }

  halfWidth = innerWidth / 2
  halfBallWidth
  offsetBallWidth1
  offsetBallWidth2
  offsetBallWidth3
  touchStartX = null
  touchStartY = null
  lastX
  lastY = 0
  deltaX
  deltaY
  moveX = 0
  moveY = 0
  centerX

  switchMenu = () => {
    if (!isMoving) {
      this.state.flag = !this.state.flag
      this.setState(this.state)
    }
  }

  winResize = () => {
    canTouch = false
    this.halfWidth = innerWidth / 2
    this.halfBallWidth = this.refs.floatBall.offsetWidth / 2
    this.offsetBallWidth1 = this.refs.floatBall.offsetWidth / 2
    this.offsetBallWidth2 = this.refs.floatBall.offsetWidth / 2
    this.offsetBallWidth3 = window.innerWidth - this.offsetBallWidth1 + this.offsetBallWidth2
  }

  touchStart = (e) => {
    if (canTouch) {
      window.addEventListener('touchmove', this.winMove)
      window.addEventListener('touchend', this.touchEnd)
    } else {
      window.addEventListener('mousemove', this.winMove)
      window.addEventListener('mouseup', this.touchEnd)
    }
    this.touchStartX = e.clientX || e.touches[0].clientX
    this.touchStartY = e.clientY || e.touches[0].clientY
    this.deltaX = this.touchStartX - this.lastX
    this.deltaY = this.touchStartY - this.lastY
  }

  winMove = (event) => {
    if (this.state.positionFromLeft) {
      this.centerX = this.moveX - this.touchStartX + this.halfBallWidth - this.offsetBallWidth2
    } else {
      this.centerX = this.offsetBallWidth3 - this.touchStartX + this.moveX
    }
    isMoving = true
    if (this.state.flag) this.state.flag = false
    this.moveX = (event.clientX || (event.touches && event.touches[0].clientX)) || 0
    this.moveY = (event.clientY || (event.touches && event.touches[0].clientY)) || 0
    this.state.x = this.moveX - this.deltaX
    this.state.y = this.moveY - this.deltaY
    this.setState(this.state)
  }

  touchEnd = () => {
    if (canTouch) {
      window.removeEventListener('touchmove', this.winMove)
      window.removeEventListener('touchend', this.touchEnd)
    } else {
      window.removeEventListener('mousemove', this.winMove)
      window.removeEventListener('mouseup', this.touchEnd)
    }
    this.hoverRelocate2()
    this.lastX = this.state.x
    this.lastY = this.state.y
    this.setState(this.state)
    setTimeout(function () {
      isMoving = false
    })
  }

  getCentreX() {
    if (this.state.positionFromLeft) {
      return this.moveX - this.touchStartX
    } else {
      return this.moveX + innerWidth - this.touchStartX
    }
  }

  hoverLocate() {

  }

  hoverRelocate2() {
    if (this.moveX !== 0) {
      if (this.centerX >= this.halfWidth) { // 落在右边
        this.state.x = innerWidth - this.offsetBallWidth1
        this.state.positionFromLeft = false
      } else { // 落在左边
        this.state.x = -this.offsetBallWidth2
        this.state.positionFromLeft = true
      }
    }
  }

  hoverRelocate() {
    if (this.moveX !== 0) {
      if (this.getCentreX() >= this.halfWidth) { // 落在右边
        this.state.x = this.initialPositionLeft ? innerWidth : 0
        this.state.positionFromLeft = false
      } else { // 落在左边
        this.state.x = this.initialPositionLeft ? 0 : -innerWidth
        this.state.positionFromLeft = true
      }
    }
  }

  componentWillMount() {
    window.addEventListener('resize', this.winResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.winResize)
  }

  componentDidMount() {
    this.halfBallWidth = this.refs.floatBall.offsetWidth / 2
    this.offsetBallWidth1 = this.refs.floatBall.offsetWidth / 2
    this.offsetBallWidth2 = this.refs.floatBall.offsetWidth / 2
    this.offsetBallWidth3 = window.innerWidth - this.offsetBallWidth1 + this.offsetBallWidth2
    this.state.x = this.state.positionFromLeft ? -this.offsetBallWidth2 : window.innerWidth - this.offsetBallWidth1
    this.lastX = this.state.positionFromLeft ? 0 : this.state.x
    this.setState(this.state)
  }

  render() {
    return <div className={"floatBall" + (this.state.flag ? ' active ' : '')}
      ref="floatBall"
      style={{
        transform: `translate(${this.state.x}px, ${this.state.y}px)`,
        top: RG.jssdk.config.hoverTop + 'rem' || '40rem'
      }}
      onClick={this.switchMenu}
      onMouseDown={(e) => {
        if (!canTouch) {
          this.touchStart(e)
        }
      }}
      onTouchStart={(e) => {
        canTouch = true
        this.touchStart(e)
      }}
    >
      <div className="ball"></div>
      <div className={'menu' + (this.state.flag ? ' active ' : '') + (this.state.positionFromLeft ? ' left' : '')}>
        {this.props.isGuest ? <div className="item">
          <a className="icon account"
            onClick={() => {
              Ins.showAccount()
            }}
          >
            {RG.jssdk.config.i18n.float_button_bind_account}
          </a>
        </div> : <div className="item">
            <a className="icon account"
              onClick={() => {
                Ins.showAccount()
              }}
            >
              {RG.jssdk.config.i18n.float_button_user_center}
            </a>
          </div>}
        <div className="item">
          <a className="icon contact"
            onClick={() => {
              RG.Mark("sdk_contact_us")
              RG.Messenger()
            }}
          >
            {RG.jssdk.config.i18n.float_button_service}
          </a>
        </div>
      </div>
    </div>
  }



}

