import Base from './base';

/* 与首页postMessage 的通信, 添加到桌面 */
export default class WebSdk extends Base {
  type: 1;
  constructor(config: Config) {
    super();
    this.initConfig(config);
  }
}

// if (config.type === 1) {
//   const indexUrl = IS_DEV || IS_TEST ? config.page.index.test : config.page.index.formal;
//   w.parent.postMessage(
//     JSON.stringify({action: 'get'}),
//     /(http|https):\/\/(www.)?([A-Za-z0-9-_]+(\.)?)+/.exec(indexUrl)[0]
//   );
// }
/* 
    // 只用于web端的sdk，暂时先写在这里
    if (type === 1) {
      // 测试的基本上域名是一样的,因此没有做区分
      const indexUrl = IS_DEV ? config.page.index.test : config.page.index.formal;
      w.addEventListener('message', onMessage(indexUrl), false);
    }

*/
/* 从首页接收用户信息,当浏览器的保存到桌面生效后 */
function onMessage(indexUrl: string) {
  return function(event: MessageEvent) {
    if (event.origin !== /(http|https):\/\/(www.)?([A-Za-z0-9-_]+(\.)?)+/.exec(indexUrl)[0]) return;
    if (event.data === 'rgclose') return;
    RG.jssdk.account.init(JSON.parse(event.data));
  };
}
