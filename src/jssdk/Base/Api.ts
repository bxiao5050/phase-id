import * as Const from "./Constant"
import { signed } from "../utils";
import Http from "./Http";

export default class Api {
  static _ins: Api
  static get instance(): Api {
    return this._ins || new Api;
  }
  constructor() {
    Api._ins = this
  }

  private route = {
    bind: Const.RouteBindZone,
    bindVisitor: Const.RouteBindVisitor
  }

  /** 绑定区服 */
  public async Bind(BindZoneParam: BindZoneParam) {

    var deviceMsg = await JsToNative.getDeviceMsgAsync()

    var data = Object.assign(
      deviceMsg,
      BindZoneParam,
      {
        sign: signed([
          BindZoneParam.userId,
          RG.jssdk.config.appId,
          BindZoneParam.gameZoneId,
          deviceMsg.source,
          RG.jssdk.config.app_key
        ])
      }
    )
    return Http.instance.post({ route: this.route.bind, data }).then(data => {
      return data
    })
  }

  public BindVisitor(account: string, password: string) {
    var data = {
      appId: RG.jssdk.config.appId,
      userId: RG.CurUserInfo().userId,
      userName: account,
      password: password,
      email: '',
      sign: signed([
        RG.jssdk.config.appId,
        RG.CurUserInfo().userId,
        account,
        password,
        RG.jssdk.config.app_key
      ])
    }
    return Http.instance.post({ route: this.route.bindVisitor, data }).then(data => {
      if (data.code === 200) {
        var userInfo = RG.jssdk.Account.user

        userInfo.userName = account
        RG.jssdk.Account.user = userInfo
      }
      return data
    })
  }

}
