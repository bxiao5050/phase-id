import('swiper/dist/css/swiper.min.css' as any)
import('./style.css' as any)

import * as React from 'react';
import Swiper from 'react-id-swiper';
import swiper from 'swiper';

export default class Slides extends React.Component<{
  system: string;
  i18n: any;
  language: string
}> {
  constructor(props) {
    super(props)
  }

  swiper: swiper

  componentDidMount() {
    // setInterval(() => {
    //   this.swiper.slideNext()
    // }, 3000)
    this.swiper.slideNext();
    this.swiper.slideNext();
    this.swiper.slideNext();
  }
  config = {
    containerClass: 'swiper-container',
    // loop: true,
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      dynamicBullets: true
    },
  }

  render() {
    const i18n = this.props.i18n as {
      openMenu: string,
      selectHome: string,
      page2TopText: string,
      page2Tip1: string,
      page2Tip2: string,
      page2Tip3: string,
      page2Tip4: string,
      cancel: string,
      clickAdd: string,
      openApp: string,
      appName: string,
      add: string,
      androidAddHome: string
    };
    const language = this.props.language;
    const system = this.props.system;
    return (<div className="swiper-container-wrap">
      {system === 'ios' ? (
        <Swiper {...this.config} ref={node => node ? this.swiper = node.swiper : null}>
          <div className="ios-page1">
            <p className="ios-page1-select-text">{i18n.openMenu}</p>
            <img className="ios-page1-select-image" src={require('./assets/ios/page1_select_image.png')} alt="select" />
          </div>
          <div className="ios-page2 ios-page1">
            <div className="ios-page2-tip">
              <p className="ios-page2-top">
                <span className="ios-page2-top-text">{i18n.page2TopText}
                </span>
              </p>
              <p className="ios-page2-select-text">
                {i18n.selectHome}
              </p>
              <img className="ios-page2-select-image" src={require('./assets/ios/page2_select_image.png')} alt="select" />
              <p className={language === 'EN' ? 'ios-page2-tags' : 'ios-page2-tags ios-page2-tags-TW'}>
                <span className="ios-page2-tags-text">{i18n.page2Tip1}</span>
                <span className="ios-page2-tags-text">{i18n.page2Tip2}</span>
                <span className="ios-page2-tags-text">{i18n.page2Tip3}</span>
                <span className="ios-page2-tags-text">{i18n.page2Tip4}</span>
              </p>
              <p className="ios-page2-cancle-text">{i18n.cancel}</p>
            </div>
          </div>
          <div className="ios-page3">
            <div className="ios-page3-tip">
              <p className="ios-page3-tip-text"><span >{i18n.add}</span></p>
              <img className="ios-page3-select-image" src={require('./assets/ios/page3_select_image.png')} alt="select" />
              <p className="ios-page3-select-text">{i18n.clickAdd}</p>
            </div>
            <div className="ios-page3-icon">
              <img className="app-icon" src={require('./assets/app_icon.png')} alt="app icon" />
              <p className="ios-page3-app-name">{i18n.appName}</p>
            </div>
          </div>
          <div className="ios-page4">
            <img className="app-icon" src={require('./assets/app_icon.png')} alt="app icon" />
            <p className="ios-page4-app-name">{i18n.appName}</p>
            <p className="ios-page4-select-text" dangerouslySetInnerHTML={{ __html: i18n.openApp }} />
          </div>
        </Swiper>
      ) : (
          <Swiper {...this.config} ref={node => node ? this.swiper = node.swiper : null}>
            <div className="android-page">
              <img className="android-page1-select-image" src={require('./assets/android/page1_select_image.png')} alt="select" />
              <p className="android-select-text">{i18n.openMenu}</p>
            </div>
            <div className="android-page">
              <div className={language === 'EN' ? 'android-page2-menu android-page2-menu-EN' : 'android-page2-menu android-page2-menu-TW'}>
                <p className="android-select-text android-page2-select-text">{i18n.selectHome}</p>
                <img className="android-page2-select-image" src={require('./assets/android/page2_select_image.png')} alt="select" />
                <p className="android-page2-menu-text">{i18n.page2Tip4}</p>
              </div>
            </div>
            <div className="android-page android-page3">
              <div className="android-page3-popup">
                <p className="android-select-text android-page3-select-text">{i18n.clickAdd}</p>
                <p className="android-page3-popup-title">{i18n.androidAddHome}</p>
                <p className="app-info"><img className="app-icon" src={require('./assets/app_icon.png')} alt="app icon" /><span className="app-Name">{i18n.appName}</span></p>
                <p className="popup-button">
                  <span className={language === 'EN' ? 'popup-button-cancel' : 'popup-button-cancel popup-button-cancel-TW'}>{i18n.cancel}</span>
                  <span className="popup-button-add">{i18n.add}</span>
                </p>
                <img className="android-page3-select-image" src={require('./assets/android/page3_select_image.png')} alt="select" />
              </div>
            </div>
            <div className="android-page4">
              <img className="app-icon" src={require('./assets/app_icon.png')} alt="app icon" />
              <p className="android-page4-app-name">{i18n.appName}</p>
              <p className="android-page4-select-text">{i18n.openApp}</p>
            </div>

          </Swiper>
        )}

      <div className="clk-next" onClick={() => {
        this.swiper.slideNext()
      }}></div>
      <div className="clk-prev" onClick={() => {
        this.swiper.slidePrev()
      }}></div>
    </div>);
  }

}
