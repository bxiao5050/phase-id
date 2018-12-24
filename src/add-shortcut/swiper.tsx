import('swiper/dist/css/swiper.min.css' as any)
import('./style.css' as any)

import * as React from 'react';
import Swiper from 'react-id-swiper';
import swiper from 'swiper';

export default class Slides extends React.Component<{
  images: string[]
}> {
  constructor(props) {
    super(props)
  }

  swiper: swiper

  componentDidMount() {
    console.log(this.swiper)
    setInterval(() => {
      this.swiper.slideNext()
    }, 3000)
  }

  addItems = () => {
    const items = this.props.images.map(function (src, index) {
      src = require('./assets/' + src)
      return <div key={index} >
        <img className="swiper-img" src={src} />
      </div>
    })
    return items
  }
  config = {
    containerClass: 'swiper-container',
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      dynamicBullets: true,
    },
  }

  render() {
    return <Swiper {...this.config} ref={node => node ? this.swiper = node.swiper : null}>
      {this.addItems()}
    </Swiper >
  }

}