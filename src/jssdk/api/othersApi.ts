/* 第三方的一些 api 的封装和数据转换 */


// facebook 登录
export function fbShare(shareUrl: string) {
  console.info("facebook share" + shareUrl);
  if (!shareUrl) return Promise.reject("url is not find.");
  return new Promise((resolve, reject) => {
    FB.ui({
      method: 'share',
      href: shareUrl,
      display: 'popup'

    }, function (shareDialogResponse) {
      if (shareDialogResponse) {
        if (shareDialogResponse.error_message) {
          resolve({
            code: 0,
            error_msg: shareDialogResponse.error_message
          })
        } else {
          resolve({
            code: 200
          })
        }
      } else {
        resolve({
          code: 0
        })
      }
    })
  })
}



// facebook的登录的参数转换
function facebookLoginHandle(data: FbUserInfo): Info {
  var info: Info = { userName: 'fb-' + data.id };
  data.name && (info.nickName = data.name);
  data.email && (info.email = data.email);
  data.birthday && (info.birthday = data.birthday);
  data.gender && (info.sex = data.gender === 'male' ? 0 : 1);
  return info;
}
// 卡考登录的参数的转换
function kaKaoLoginHandle(data: KaKaoUserInfo): Info {
  var info: Info = { userName: 'kakao-' + data.id };
  data.nickname && (info.nickName = data.nickname);
  data.email && (info.email = data.email);
  data.birthday && (info.birthday = data.birthday);
  data.gender && (info.sex = data.gender === 'male' ? 0 : 1);
  return info;
}

interface FbUserInfo {
  name?: string;
  email?: string;
  birthday?: string;
  gender?: string;
  id: string;
}
interface Info {
  nickName?: string;
  email?: string;
  birthday?: string;
  sex?: 0 | 1;
  userName: string;
}
interface KaKaoUserInfo {
  nickname?: string;
  email?: string;
  birthday?: string;
  gender?: string;
  id: string;
}


