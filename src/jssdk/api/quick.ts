import Http from '../base/Http';
import {signed} from '../common/utils';

export default class Quick {
  appSecret: string = '';
  setAppSecret(appSecret: string) {
    this.appSecret = appSecret;
  }
  verifyToken(params: VerifyTokenParams) {
    params.sign = signed([params.appId, params.uid, params.token, this.appSecret]);
    
    params.token = encodeURIComponent(params.token);
    params.uid = encodeURIComponent(params.uid);
    params.sign = encodeURIComponent(params.sign);
    const route = `/quick/verifyToken/${params.appId}/${params.advChannel}/${params.uid}/${params.token}/${params.sign}`;
    return Http.ins.get({route});
  }
  getRoleInfo({appId, userId, gameZoneId}: getRoleParams) {
    const timestamp = Date.now();
    const sign = signed([userId, gameZoneId, timestamp, this.appSecret]);
    const route = `/user/role?appId=${appId}&userId=${userId}&gameZoneId=${gameZoneId}&timestamp=${timestamp}&sign=${sign}`;
    return Http.ins.get<getRoleInfoRes>({route});
  }
}
interface getRoleParams {
  appId: string;
  userId: number;
  gameZoneId: number;
  appSecret: string;
}
interface getRoleInfoRes extends ServerRes {
  data: {
    roleId: string;
    roleName: string;
    roleLevel: string;
    state: number;
    createTime: string;
    lastLoginTime: string;
    vipLevel: string;
    gameCoinTotal: string;
  }[];
}
interface VerifyTokenParams {
  /* 平台分配的appId */
  appId: string;
  /* 平台分配的游戏渠道 */
  advChannel: string;
  /* quick用户id */
  uid: string;
  /* quick 登录的 token */
  token: string;
  // md5(appId,uid,token,appSecret) appSecret 平台分配的加密参数
  sign: string;
}
