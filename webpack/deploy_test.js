const fs = require('fs');
const path = require('path');
const {NodeSSH} = require('node-ssh');

const ssh = new NodeSSH();
const username = 'chadmin';
const password = 'CH7z/I5%7c>A3b2d';
const serverConfig = {
  host: '113.107.160.108',
  port: 16888,
  username,
  password
};
async function putSdkToCNTest() {
  // 连接到国内测试服
  await ssh.connect(serverConfig);
  // 删除对应目录的过往代码
  await ssh
    .execCommand('rm -rf *.js *.css', {cwd: '/data/sdk-test/platform-sdk-test-v2.0/jssdk/v1.0.0'})
    .then(function (result) {
      if (result.stderr) return console.log(result.stderr);
      // console.log(result.stdout);
      console.log('删除 js 成功');
    });
  // 上传新代码
  const failed = [];
  const successful = [];
  const status = await ssh.putDirectory(
    path.resolve(__dirname, '../dist'),
    '/data/sdk-test/platform-sdk-test-v2.0/jssdk/v1.0.0',
    {
      recursive: true, //递归
      // concurrency: 10,//并发
      // 校验
      validate: function (itemPath) {
        const baseName = path.basename(itemPath);
        return baseName.indexOf('txt') === -1;
      },
      tick: function (localPath, remotePath, error) {
        if (error) {
          failed.push(localPath);
        } else {
          successful.push(localPath);
        }
      }
    }
  );
  console.log('sdk文件上传：' + status ? '成功' : '失败');
  console.log('失败的文件：\n' + failed.join(', \n'));
  console.log('成功的文件：\n' + successful.join(', \n'));
  ssh.dispose();
}
putSdkToCNTest();
