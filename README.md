# sdk-demo

#### 项目介绍
{**以下是码云平台说明，您可以替换为您的项目简介**
码云是开源中国推出的基于 Git 的代码托管平台（同时支持 SVN）。专为开发者提供稳定、高效、安全的云端软件开发协作平台
无论是个人、团队、或是企业，都能够用码云实现代码托管、项目管理、协作开发。企业项目请看 [https://gitee.com/enterprises](https://gitee.com/enterprises)}

#### 软件架构
软件架构说明


#### 安装教程

 - npm/cnpm i
或者
yarn (推荐)(请提前全局安装 yarn 模块 npm/cnpm yarn -g)

#### 使用说明

1. xxxx
2. xxxx
3. xxxx

#### 参与贡献

1. Fork 本项目
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request


#### 码云特技

1. 使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2. 码云官方博客 [blog.gitee.com](https://blog.gitee.com)
3. 你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解码云上的优秀开源项目
4. [GVP](https://gitee.com/gvp) 全称是码云最有价值开源项目，是码云综合评定出的优秀开源项目
5. 码云官方提供的使用手册 [http://git.mydoc.io/](http://git.mydoc.io/)
6. 码云封面人物是一档用来展示码云会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)

#### 项目计划

 - 将 react.js 版本 迁移至最新版本 
 - 兼容 facebook instant game sdk.
 - https://www.facebook.com/embed/instantgames/172357183467027/player?game_url=https%3A%2F%2Flocalhost%3A7000%2Finstant.html

 - yarn add shindousaigo-router@npm:react-router shindousaigo-react@npm:react

 - 1、先运行： npm install -g node-gyp 
 - 2、然后运行：运行 npm install --global --production windows-build-tools 可以自动安装跨平台的编译器：gym


 由于某些不可描述的原因，利用npm进行安装模块的时候会发生xxx下载失败的情况node-sass尤其的频繁，或者说node-sass的二进制文件是接近百分百失败的，即使用yarn安装也依旧在这个点失败，以下是完整的解决方案。

 

方案一：

　　首先，我们需要提前下载node-sass的二进制文件，这个文件可以去cnpm仓库下载或者node-sass的github上去下载，在下载之前我们需要先查看电脑的系统的版本，来确定适合哪个版本的二进制文件，查看版本的指令如下：

node -p "[process.platform, process.arch, process.versions.modules].join('-')"
输入这个指令后会弹出一个系统版本，比如我这弹出的是 win32-x64-48，则我就需要去以下两个地址中任意一个下载 win32-x64-48_binding.node 这个文件（后缀为node的文件）到本地：

　　cnpm: https://npm.taobao.org/mirrors/node-sass/

　　github: https://github.com/sass/node-sass/releases

下载完保存到任意位置，最好放置到package.json所在位置。然后我们需要手动指定node-sass二进制文件的下载源为下载的那个文件（比如我的是在e盘下的web文件夹内），以下是npm与yanr的指令：

npm:

npm config set sass-binary-path e:/web/win32-x64-48_binding.node
yran:

yarn config set sass-binary-path e:/web/win32-x64-48_binding.node
然后我们即可用正常指令下载了。注意：此方法会绑定为本地文件，即无法更新node-sass了~~如果不希望这么做，请使用第二种方案。

方案二：

此方案将把下载源指定为cnpm仓库：

全部的下载源指向cnpm的指令:

　　npm :

npm config set registry http://registry.npm.taobao.org
　　yarn :

yarn config set registry http://registry.npm.taobao.org
　只指定node-sass的下载源：

　　npm：

npm config set 
sass-binary-site
 
http://npm.taobao.org/mirrors/node-sass
　　yarn：

yarn config set 
sass-binary-site
 
http://npm.taobao.org/mirrors/node-sass
　　然后我可以正常使用npm或者yarn进行下载了~

最后，关于如何使用cnpm代替npm。。。。直接npm install cnpm -g就好了-。-~~~~  然后就可以直接用cnpm install XXX等指令安装了。

test