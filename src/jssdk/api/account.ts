/* 
  操作所有用户信息的类
*/
export default class Account {
  static _ins: Account;
  static get ins(): Account {
    return this._ins || new Account();
  }
  constructor() {
    Account._ins = this;
    const user = JSON.parse(localStorage.getItem('user'));
    const users = JSON.parse(localStorage.getItem('users'));
    this.init(user, users);
  }
  /** 当前用户 */
  private _user: UserInfo;
  /** 用户组 */
  private _users: UsersInfo = {};
  private userKey: string = 'user';
  private usersKey: string = 'users';
  get user() {
    return this._user;
  }
  set user(user: UserInfo) {
    this._user = user;
    // facebook 用户不保存
    if (user && user.accountType != 2) {
      this._users[user.userId] = user;
    }
  }
  get users() {
    return this._users;
  }
  deleteUser(userId: number) {
    if (this._users[userId]) {
      delete this._users[userId];
    }
    if (this.user.userId === userId) {
      this._user = null;
    }
  }
  save() {
    localStorage.setItem(this.userKey, JSON.stringify(this._user));
    localStorage.setItem(this.usersKey, JSON.stringify(this._users));
  }
  init(user: UserInfo, users: UsersInfo) {
    if (user) {
      this._user = user;
    }
    if (users) {
      this._users = users;
    }
  }
}

export interface UserInfo {
  userId: number;
  userName: string;
  userType: UserType;
  accountType: number;
  emailValid: number;
  password: string;
  firstLogin: number;
  token: string;
}
export interface UsersInfo {
  [key: string]: UserInfo;
}
