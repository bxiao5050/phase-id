import Utils from "Base/Utils";
import Http from "Src/Base/Http";
import * as Const from "Src/Base/Constant"

export default class Account {
  static _ins: Account
  static get instance(): Account {
    return this._ins || new Account;
  }
  constructor() {
    Account._ins = this
    this.init()
  }

  private route = {
    changepass: Const.RouteChangePassword
  }

  /** 当前用户 */
  private _userInfo: UserInfo
  /** 用户组 */
  private _usersInfo: UsersInfo

  protected init() {
    this._userInfo = JSON.parse(localStorage.getItem(Const.UserInfo))
    this._usersInfo = JSON.parse(localStorage.getItem(Const.UsersInfo)) || {}
  }

  get userInfo() {
    return this._userInfo
  }

  get usersInfo() {
    return this._usersInfo
  }

  set userInfo(userInfo) {
    this._userInfo = userInfo
    localStorage.setItem(Const.UserInfo, JSON.stringify(userInfo))
    this._usersInfo[userInfo.userId] = userInfo
    localStorage.setItem(Const.UsersInfo, JSON.stringify(this._usersInfo))
  }

  delCurUser(userId) {
    this._userInfo = null
    localStorage.setItem(Const.UserInfo, JSON.stringify(null))
    this._usersInfo[userId] = null
    localStorage.setItem(Const.UsersInfo, JSON.stringify(this._usersInfo))
  }

  set usersInfo(usersInfo) {
    this._usersInfo = usersInfo
    localStorage.setItem(Const.UsersInfo, JSON.stringify(usersInfo))
  }

  changePass(oldpass, newpass) {
    var data = {
      appId: RG.jssdk.config.appId,
      userId: this.userInfo.userId,
      password: oldpass,
      newPassword: newpass,
      sign: null
    }

    data.sign = Utils.signed({
      appId: RG.jssdk.config.appId,
      userId: this.userInfo.userId,
      password: oldpass,
      newPassword: newpass
    });

    return Http.instance.post({
      route: this.route.changepass,
      data: data
    })
  }



}