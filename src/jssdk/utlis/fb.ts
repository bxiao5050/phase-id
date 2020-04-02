/* 
  facebook 微端登录
  1. 不能跳出微端
  2. 可以切换账号
*/
export async function fbLogin(facebookId: string, isLogout: boolean) {
  const response = await checkFBLogin(facebookId);
  if (response.status === 'connected') {
    if (isLogout) {
      await fbLogout(facebookId);
      toFbLogin(facebookId);
    } else {
      let fbUserInfo = await getFBUserInfo();
      fbUserInfo.userID = response.authResponse.userID;
      const userFbRegisterInfo = {
        userId: fbUserInfo.userID,
        userName: 'fb-' + fbUserInfo.userID,
        password: '',
        accountType: 2,
        email: fbUserInfo.email,
        userChannel: 0,
        nickName: fbUserInfo.name
      };
      return userFbRegisterInfo;
    }
  } else {
    toFbLogin(facebookId);
  }
}
/* 检查Facebook用户登录 */
function checkFBLogin(facebookId: string) {
  return new Promise<facebook.StatusResponse>((resolve, reject) => {
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected' && getItem(`fblo_${facebookId}`)) {
        document.cookie =
          `fblo_${facebookId}` +
          `=;expires=${new Date(Date.now() - 10000)};domain=.${location.hostname}; path=/`;
        document.cookie = `fblo_${facebookId}` + `=;expires=${new Date(Date.now() - 10000)};path=/`;
      }
      resolve(response);
    });
  });
}
/* 获取facebook用户的信息 */
function getFBUserInfo() {
  return new Promise<any>(res => {
    FB.api('/me?fields=email,name', (response: any) => {
      console.log(response);
      if (response) {
        res(response);
      } else {
        console.error('get facebook userInfo error');
      }
    });
  });
}
/* 跳转去facebook页面登录 */
function toFbLogin(facebookId: string) {
  let index = location.href.indexOf('&code=');
  let url = index === -1 ? location.href : location.href.substr(0, index);
  location.href = `https://www.facebook.com/${FBVersion}/dialog/oauth?client_id=${facebookId}&redirect_uri=${encodeURIComponent(
    url
  )}&t=${Date.now()}`;
}
/* 登出Facebook账号 */
function fbLogout(facebookId: string) {
  return new Promise(resolve => {
    FB.logout(response => {
      document.cookie = `fblo_${facebookId}=n;expires=${new Date(
        Date.now() + 1000 * 3600 * 24 * 365
      )};domain=.${location.hostname}; path=/`;
      document.cookie = `fblo_${facebookId}=n;expires=${new Date(
        Date.now() + 1000 * 3600 * 24 * 365
      )};path=/`;
      resolve();
    });
  });
}
/* 分享 */
export function fbShare(url: string):Promise<{code:number,error_msg?:string}> {
  console.info('facebook share' + url);
  return new Promise((resolve, reject) => {
    FB.ui(
      {
        method: 'share',
        href: url,
        display: 'popup'
      },
      function(shareDialogResponse) {
        if (shareDialogResponse) {
          if (shareDialogResponse.error_message) {
            resolve({
              code: 400,
              error_msg: shareDialogResponse.error_message
            });
          } else {
            resolve({
              code: 200
            });
          }
        } else {
          resolve({
            code: 400
          });
        }
      }
    );
  });
}
/* 获取页面的cookie */
function getItem(sKey: string) {
  return (
    decodeURIComponent(
      document.cookie.replace(
        new RegExp(
          '(?:(?:^|.*;)\\s*' +
            encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') +
            '\\s*\\=\\s*([^;]*).*$)|^.*$'
        ),
        '$1'
      )
    ) || null
  );
}
