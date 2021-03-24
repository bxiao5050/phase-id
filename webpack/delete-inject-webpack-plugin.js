// 如果您的插件直接依赖于html webpack插件：
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 如果您的插件使用html-webpack-plugin作为可选依赖项
// you can use https://github.com/tallesl/node-safe-require instead:
// const HtmlWebpackPlugin = require('safe-require')('html-webpack-plugin');

class DeleteInjectScriptPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('DeleteInjectScriptPlugin', compilation => {
      console.log('The compiler is starting DeleteInjectScriptPlugin');

      // Static Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'DeleteInjectScriptPlugin', // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          // Manipulate the content
          data.html = data.html.replace('<script defer="defer" src="sdk.js"></script>', "");
          // console.log(data.html)
          // Tell webpack to move on
          cb(null, data);
        }
      );
    });
  }
}

module.exports = DeleteInjectScriptPlugin;
