/*
  所有的和 quick 联运需要的接口
*/
import Http from "../Base/Http";
import { RouteGetRoleInfo, RouteQuickVerifyToken } from "./Routes";
/* 绑定区服需要的参数 */
export function reqGameRokeInfo({ appId, userId, gameZoneId, timestamp, sign }: GameRoleInfoParams): Promise<GameRoleInfoRes> {
  const route = `${RouteGetRoleInfo}?appId=${appId}&userId=${userId}&gameZoneId=${gameZoneId}&timestamp=${timestamp}&sign=${sign}`;
  return Http.instance.get({ route });
}

/* quick 登录校验 */

export function reqQuickVerifyToken({ appId, advChannel, uid, token, sign }: QuickVerifyTokenParams): Promise<Res> {
  const route = `${RouteQuickVerifyToken}/${appId}/${advChannel}/${encodeURIComponent(uid)}/${encodeURIComponent(token)}/${encodeURIComponent(sign)}`;
  return Http.instance.get({ route });
}

interface GameRoleInfoParams {
  /* 平台分配的appId */
  appId: string;
  /* 平台用户id */
  userId: number;
  /* 用户区服Id */
  gameZoneId: number;
  //:时间戳毫秒值
  timestamp: number;
  // md5(userId,gameZoneId,timestamp,appSecret) appSecret 平台分配的加密参数
  sign: string;
}

interface GameRoleInfoRes {
  data: {
    // 角色id
    roleId: string,
    // 角色名
    roleName: string,
    // 角色等级
    roleLevel: string,
    // 0=正常 1=删除 2=废弃
    state: number,
    // 2019-08-10 14:12:51 角色创建时间
    createTime: string,
    // 上一次登录时间
    lastLoginTime: string,
    // VIP等级
    vipLevel: string,
    // 剩余游戏币数量
    gameCoinTotal: string
  }[]
}

interface QuickVerifyTokenParams {
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
