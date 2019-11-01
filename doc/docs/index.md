# JavaScript 版 RoyalGame SDK v2.3

提供登录， 绑定区服，支付 等功能

## 快速入门

JavaScript 版 SDK 无需下载和安装任何独立文件，您只需在 HTML 中添加一小段正确的 JavaScript，即可将 SDK 加载至您的页面。

以下代码片段将提供基础版的 SDK。请直接将此代码片段插入想要加载 SDK 的每个页面的开始 `<body>` 标签之后：

```js

// 游戏方实现的函数，在登录完成后会调用，请在加载sdk之前实现
window.rgAsyncInit = function () {
  // 获取用户信息
  var user = RG.CurUserInfo()
}

/** 加载jsssdk */
(function (d, s, id) {
  // 提供获取地址栏查询参数的一个函数
  var u = (function () {
    var i = location.href.indexOf("?") + 1;
    var t = i === 0 ? "" : location.href.slice(i);
    if(!t) return (k) => null;
    var p = t.split(/&|%26/).reduce((o,t) => {
      var a = t.split(/=|%3D/);
      o[a[0]] = a[1];
      return o;
    },{});
    return (k) => p.hasOwnProperty(k) ? p[k] : null;
  })();
  if(!u('region') || !u('sdkVersion')) return throw "region or sdkVersion is not find."
  // 根据region来加载 对应地区的sdk,jssdk静态文件地址: ${HOST}/jssdk/${GET.sdkVersion}/sdk.js
  var hosts = {
    sg: 'https://sdk-sg.pocketgamesol.com',
    de: 'https://sdk-de.pocketgamesol.com',
    vn: 'https://sdk-vn.pocketgamesol.com',
    test: 'https://sdk-test.changic.net.cn'
  };

  if (d.getElementById(id)) return;
  var js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
  js.id = id;
  js.src = hosts[u('region')] + '/jssdk' + u('sdkVersion') + '/sdk.js?t='+ Date.now();
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'rg-jssdk'));

```

## 登录

在SDK加载完成以后 SDK会自动调起登录弹窗等相关操作，用户可在弹窗中进行登录注册操作，登录/注册完毕后会将数据保存在本地localstorage中, 然后执行全局初始化函数 rgAsyncInit

* **window.rgAsyncInit**

* 全局的初始化函数


## 获取当前用户信息

* **RG.CurUserInfo**

**方法说明：**

* 获取当前用户信息

**返回参数说明：**

* **userId**: 用户id　　
* **userName**: 用户名　　
* **token**: 用户口令　　

**使用方法：**
```
var curUser = RG.CurUserInfo()
```

## 绑定区服 

* **RG.BindZone**

**方法说明：**

* 游戏在用户登录创角后需进行区服绑定操作，否则后台无数据

**主要参数说明：**

* **userId**: 用户id
* **gameZoneId**: 区服id
* **createRole**: 是否创角，0为否，1为是
* **roleId**: 角色id
* **level**: 角色等级

**返回参数说明：**

```
RG.BindZone(data): Promise<Res>

Res: {
  code: number  // 200 为绑定成功
  error_msg: string
}
```
**使用方法：**
```js

var data = {
  userId: 25086659,
  gameZoneId: 1,
  createRole: 0,
  roleId: 123,
  level: 1
}

RG.BindZone(data).then(function(data) {
  if(data.code === 200) { // 绑定完成
    ...
  }
});
```

## 调起支付 

* **RG.Pay**

<!-- * **RG.hasProducts** -->

**方法说明：**

* 调起支付弹窗

<!-- * RG.hasProducts: boolean 用于判断是否为facebook支付 -->

**主要参数说明：**

* **userId**: 用户id
* **gameZoneId**: 区服id
* **gameOrderId**: 游戏订单id
* **roleId**: 角色id
* **roleName**: 角色名
* **level**: 角色等级
* **gameCoin**: 游戏币的数量
<!-- * **product_id ?(not required)**: 购买的商品ID; 目前只有facebook支付需要用到， 具体的商品id由平台方提供 -->

使用方法：

```js
// {
//   /* 用户Id */
//   userId: number
//   /* 游戏订单Id */
//   gameOrderId: string;
//   /* 游戏区服Id */
//   gameZoneId: string;
//   /* 角色Id */
//   roleId: string;
//   /* 角色名 */
//   roleName: string;
//   /* 角色等级 */
//   level: string;
//   /* 游戏币数量 */
//   gameCoin: number;
// }
var data = {
  userId: 25086659,
  gameOrderId: '86353509', // 假设的订单id
  gameZoneId:'1',
  roleId: '1001',
  roleName: "role name",
  level: '12',
  gameCoin: 100
}

RG.Pay(data)
```

## 调起FB分享 

* **RG.Share**

**方法说明：**

* 调起FB分享

```
RG.Share(ShareUrl): Promise<Res>

Res: {
  code: number  // 200 为分享成功
  error_msg?: string
}
```
**使用方法：**
```
RG.Share('https://some-gaming-address-to-share.com').then(function(data) {
   // 分享成功,facebook的分享因facebook的平台的原因,不能判断分享弹窗调起后用户是否真实的分享,只能在弹窗关闭后默认分享成功
})
```

## 打点
 
* **RG.Mark**

**方法说明：**

* 通过调用Mark方法，传入对应的打点名即可完成打点

* **google**: google的打点的参数，可以不传
* **adjust**: adjust的打点的参数，可以不传
* **currency**: 只在购买打点是传
* **money**: 只在购买打点时传
* **eventToken**: adjust打点时传

```
使用方法 
RG.Mark(markName: string, param?: {google?: object, adjust?: object, currency?: string, money?: string}): void
```

## 引导用户添加桌面收藏

* **RG.Install**

**方法说明：**

* 跳转至添加桌面收藏的引导页面

```
// 此方法只在web端调用有效
RG.Install && RG.Install() 
```

## 切换账号的事件接口

* **RG.ChangeAccount**

**方法说明：**

* 在用户点击切换账户时调用 此方法应该返回一个Promise对象的实例


```
// RG.ChangeAccount instanceof Promise === true
let changeAccountResolve
let changeAccountPromise = function() {
  return new Promise(function(resolve) {
    changeAccountResolve = resolve
  })
}
let asyncFn = function() {
  ... ...
  changeAccountResolve()
}
asyncFn()

RG.ChangeAccount = changeAccountPromise
```
## 重定向至登录页面

* **RG.Redirect**

**方法说明：**

* token校验失败后 重定向至登录页面

```
RG.Redirect() 
```




