import * as React from 'react'
import './WinOpen.scss'
export default class WinOpen extends React.Component<any, any, any>  {

  render() {
    return <div className="win-open">
      <div className="cover"></div>
      <div className="box">
        <div className="close" onClick={() => {
          this.props.parent.setState({
            winOpen: false
          })
        }}></div>
        <div className="upper">
          {SDK.config.i18n.winopen}
        </div>
        <div className="udder">
          <div className="btn-jump" onClick={() => {
            window.open(this.props.parent.state.url)
            this.props.parent.setState({
              winOpen: false
            })
          }}>
            {SDK.config.i18n.jump}
          </div>
        </div>
      </div>
    </div>
  }

}