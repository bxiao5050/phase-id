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
│   ├── jssdk # sdk目录
│   │   ├── Base #
│   │   │   ├── DOM
│   │   │   └── main.ts # 主入口
│   │   ├── DOM #dom组件的内容 
│   │   ├── native #微端sdk，暂时未使用 
│   │   ├── plugins #第三方插件
│   │   ├── untils #公共方法 ，暂时未使用 
│   │   └── main.ts # 主入口
│   │  
│   ├── add-shortcut.html # 引导页的html文件
│   └── index.html # 测试启动的页面
│ 
├── .editorconfig #格式化样式配置文件
├── 。gitignore #git版本控制忽略文件
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



注意事项：
1. sdk_purchased_done 这个点的点名不能改变的，在微端根据这个点名来判断进行购买打点
