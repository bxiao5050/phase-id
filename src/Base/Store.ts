export default class Store {
  static _ins: Store
  static get instance(): Store {
    return this._ins || new Store;
  }
  constructor() {
    Store._ins = this
    // this.map = Base.config
  }

  public map: StoreMap

  private setItem(key: string, value) {
    this.map[key] = value
  }

  // setFb(): any {
  //   var ready
  //   var promise = new Promise((resolve, reject) => {
  //     ready = resolve
  //   })
  //   this.setItem("FB", promise)
  //   return ready
  // }

  // setFbLoginStatus() {
  //   var promise = new Promise((resolve, reject) => {
  //     FB.getLoginStatus(response => {
  //       if (response.status === "connected") {
  //         var userID = response.authResponse.userID
  //         FB.api('/me?fields=name,email,birthday,gender', function (response) {
  //           response.userID = userID
  //           console.log('response.userID', response.userID)
  //           resolve(response)
  //         })
  //       } else {
  //         reject(response.status)
  //       }
  //     })
  //   })
  //   this.setItem("FbLoginStatus", promise)
  // }

  // setFbLogin(): Promise<fb.AuthResponse> {
  //   var promise: Promise<fb.AuthResponse> = new Promise((resolve, reject) => {
  //     FB.login(response => {
  //       if (response.status === "connected") {
  //         var userID = response.authResponse.userID
  //         FB.api('/me?fields=name,email,birthday,gender', function (response) {
  //           response.userID = userID
  //           resolve(response)
  //         })
  //       } else {
  //         reject(response.status)
  //       }
  //     }, {
  //         scope: 'email,user_birthday,user_gender'
  //       })
  //   })
  //   this.setItem("FbLogin", promise)
  //   return promise
  // }

}




