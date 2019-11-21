# sdk-demo
## v2.3

```sh
├── build # 打包目录
│   └── vxxxx #对应版本
├── doc # jssdk的文档
├── src # 代码目录
│   ├── add-shortcut # 引导桌面收藏目录
│   │   ├── assets # 资源目录
│   │   ├── App.tsx # 主页面
│   │   ├── i18n.ts # 本地化资源
│   │   ├── main.ts # 入口
│   │   ├── style.css # 引导页样式
│   │   └── swiper.tsx # swiper组件
│   │   
│   ├── index # 游戏首页，已经废弃，全部加载在sspa中
│   │   └── main
|   ├─ jssdk
|       ├─ 0_Old #以前的代码
|       ├─ Base 
|       |   ├─ Account.ts
|       |   ├─ Api.ts
|       |   ├─ Constant.ts
|       |   ├─ Http.ts
|       |   ├─ Login.ts
|       |   ├─ Payment.ts
|       |   ├─ Share.ts
|       |   └── index.ts
|       ├─ DOM
|       |   ├─ App.tsx
|       |   ├─ BTgame.tsx
|       |   ├─ assets #图片资源
|       |   ├─ base.scss
|       |   ├─ components
|       |   |   ├─ account
|       |   |   |   ├─ index.scss
|       |   |   |   ├─ index.tsx
|       |   |   ├─ hover
|       |   |   |   ├─ index.scss
|       |   |   |   ├─ index.tsx
|       |   |   ├─ login
|       |   |   |   ├─ Choose.scss
|       |   |   |   ├─ Choose.tsx
|       |   |   |   ├─ Entry.scss
|       |   |   |   ├─ Entry.tsx
|       |   |   |   ├─ Loading.scss
|       |   |   |   ├─ Loading.tsx
|       |   |   |   ├─ Main.scss
|       |   |   |   ├─ Main.tsx
|       |   |   |   ├─ Register.scss
|       |   |   |   ├─ Register.tsx
|       |   |   |   ├─ index.scss
|       |   |   |   ├─ index.tsx
|       |   |   ├─ notice
|       |   |   |   ├─ index.scss
|       |   |   |   ├─ index.tsx
|       |   |   ├─ payment
|       |   |       ├─ Type0.scss
|       |   |       ├─ Type0.tsx
|       |   |       ├─ Type1.scss
|       |   |       ├─ Type1.tsx
|       |   |       ├─ Type2.scss
|       |   |       ├─ Type2.tsx
|       |   |       ├─ Type3.scss
|       |   |       ├─ Type3.tsx
|       |   |       ├─ Type4.scss
|       |   |       ├─ Type4.tsx
|       |   |       ├─ Type5.scss
|       |   |       ├─ Type5.tsx
|       |   |       ├─ TypeList.scss
|       |   |       ├─ TypeList.tsx
|       |   |       ├─ WinOpen.scss
|       |   |       ├─ WinOpen.tsx
|       |   |       ├─ index.scss
|       |   |       ├─ index.tsx
|       |   ├─ i18n #本地化
|       |   ├─ index.tsx
|       ├─ FacebookInstantGames.ts
|       ├─ FacebookWebGames.ts
|       ├─ Native.ts
|       ├─ Web.ts
|       ├─ adapter.ts
|       ├─ api #暂时没有用到
|       ├─ config #所有的配置
|       |   ├─ 10183-0.ts
|       |   ├─ 10183-1.ts
|       |   ├─ 10183-30001.ts
|       |   ├─ 10183-33001.ts
|       |   ├─ 10203-0.ts
|       |   ├─ 10203-1.ts
|       |   ├─ 10203-30001.ts
|       |   ├─ 10213-0.ts
|       |   ├─ index.ts
|       ├─ dev 测试代码
|       ├─ main.ts
|       ├─ plugins 第三方插件
|       ├─ uniteSdk #联运的sdk quick
|       |   ├─ index.ts
|       └── utils #工具函数
├── test # 测试代码目录
├── .editorconfig #格式化样式配置文件
├── .gitignore #git版本控制忽略文件
├── babel.config.js #babel配置文件
├── index.d.ts # 全局类型文件
├── jest.config.js #jest测试的配置文件
├── package.json  #npm
├── postcss.config.js #postcss的配置文件
├── tsconfig.json #ts的配置文件
├── vconsole.min.js #移动端日志打印的库文件
├── webpack.config.js #webpack打包的配置文件
└── yarn.lock # yarn下载包的版本控制文件
```



### 注意事项：

  1. sdk_purchased_done 这个点的点名不能改变的，在微端根据这个点名来判断进行购买打点;
  2. 本地开发测试文件利用webpack加载,更改window上的值.
  3. 绑定游客和除登录之外返回用户信息的接口,都不会更新一些accountType这些值,需要自己去做操作

### 需完成的点

  1. 登录添加忘记密码功能，点击后弹出输入账号发送邮件修改密码功能，忘记账号联系客服
  2. 添加邮箱功能，http://ip:port/pocketgames/client/user/operatorEmail   使用此接口添加 operatorType这个值暂时没有用可以直接传0;
