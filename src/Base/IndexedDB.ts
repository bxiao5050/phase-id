// class IndexedDB {
//   static _ins: IndexedDB
//   static get instance(): IndexedDB {
//     return this._ins || new IndexedDB;
//   }
//   constructor() {
//     IndexedDB._ins = this
//     this.init()
//   }

//   private dbName = STORE_PREFIX + "-map"
//   private tablename = "map"

//   setUsers(usersInfo) {
//     return this.setItem('users', usersInfo)
//   }

//   getUsers() {
//     return this.getItem('users')
//   }

//   getUser() {
//     return this.getItem('user')
//   }

//   setUser(userInfo) {
//     return this.setItem('user', userInfo)
//   }

//   database: IDBDatabase
//   IDBOpenDBRequest_: IDBOpenDBRequest
//   init() {
//     this.IDBOpenDBRequest_ = indexedDB.open(this.dbName)
//     this.IDBOpenDBRequest_.onupgradeneeded = ({ target }: any) => {
//       var database: IDBDatabase = target.result
//       if (!database.objectStoreNames.contains(this.tablename)) {
//         database.createObjectStore(this.tablename)
//       }
//     }
//     this.isReady()
//   }

//   isReady(): Promise<IDBDatabase> {
//     return new Promise(resolve => {
//       this.IDBOpenDBRequest_.onsuccess = ({ target }: any) => {
//         this.database = target.result
//         resolve(this.database)
//       }
//     })
//   }

//   async getStore(): Promise<IDBObjectStore> {
//     var database = this.database || await this.isReady()
//     return database.transaction(this.tablename, "readwrite").objectStore(this.tablename)
//   }

//   async getItem(key): Promise<any> {
//     var store = await this.getStore()
//     return new Promise(resolve => {
//       store.get(key).onsuccess = function ({ target }: any) {
//         resolve(target.result)
//       }
//     })
//   }

//   async setItem(key: string, value): Promise<any> {
//     var store = await this.getStore()
//     return new Promise(resolve => {
//       store.put(value, key).onsuccess = function ({ target }: any) {
//         resolve(value)
//       }
//     })
//   }

// }