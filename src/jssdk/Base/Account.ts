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
    this.initPromise = new Promise(resolve => {
      this.initResolve = resolve
    })
  }

  /** 当前用户 */
  private _user: UserInfo
  /** 用户组 */
  private _users: UsersInfo = {}

  initResolve
  initPromise

  init(data) {
    this._user = data.user
    this._users = data.users
    this.initResolve()
  }

  get user() {
    return this._user
  }

  get users() {
    return this._users
  }

  asyncData() {
    window.parent.postMessage({
      action: 'set',
      data: {
        user: this._user,
        users: this._users
      }
    }, window.$rg_main.Mark.index_url.origin)
  }

  set user(user) {
    this._user = user
    this._users[user.userId] = user
    this.asyncData()
  }

  set users(users) {
    this._users = users
    this.asyncData()
  }

  delCurUser(userId) {
    if (this._users[userId]) {
      delete this._users[userId]
      this._user = null
      this.asyncData()
    }
  }

  changePass(oldpass: string, newpass: string) {
    var data = {
      appId: RG.jssdk.config.appId,
      userId: this.user.userId,
      password: oldpass,
      newPassword: newpass,
      sign: null
    }

    data.sign = Utils.signed({
      appId: RG.jssdk.config.appId,
      userId: this.user.userId,
      password: oldpass,
      newPassword: newpass
    });

    return Http.instance.post({
      route: Const.RouteChangePassword,
      data: data
    })
  }



}