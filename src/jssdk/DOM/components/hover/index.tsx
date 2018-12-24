import './index.scss'
import * as React from 'react'
import { History } from 'history'
import { Ins } from 'DOM/index'
import { DOT } from 'Src/Base/Constant';

var canTouch = false
var isMoving = false

export default class Hover extends React.Component<{
  history?: History
  isGuest: boolean
}, {}, any> {

  public refs: {
    hover: HTMLElement
  }

  constructor(props) {
    super(props)
  }

  state = {
    flag: false,
    x: 0,
    y: 0,
    positionFromLeft: false
  }

  halfWidth = innerWidth * .5
  touchStartX = null
  touchStartY = null
  lastX = 0
  lastY = 0
  initialPositionLeft = false


  switchMenu = () => {
    if (!isMoving) {
      this.state.flag = !this.state.flag
      this.setState(this.state)
    }
  }

  winResize = () => {
    canTouch = false
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

    // if (this.touchStartX < this.halfWidth) {
    //   this.state.positionFromLeft = true
    // } else {
    //   this.state.positionFromLeft = false
    // }

  }

  deltaX
  deltaY
  moveX = 0
  moveY = 0

  winMove = (event) => {
    isMoving = true
    if (this.state.flag) this.state.flag = false
    this.moveX = (event.clientX || event.touches[0].clientX)
    this.moveY = (event.clientY || event.touches[0].clientY)
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
    this.hoverRelocate()
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

  render() {
    return <div className={"floatBall"}
      style={(() => {
        var combine
        if (this.initialPositionLeft) {
          combine = { left: '-1.6rem' }
        } else {
          combine = { right: '-1.6rem' }
        }
        return Object.assign({
          transform: `translate(${this.state.x}px, ${this.state.y}px)`
        }, combine)
      })()}
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
              RG.Mark(DOT.SDK_CONTACT_US)
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

