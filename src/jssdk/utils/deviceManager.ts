
type DeviceTypes = {
  ios: boolean,
  iPhone: boolean,
  iPad: boolean,
  android: boolean,
  win: boolean
}


export class DeviceManager {
  private static _ins: DeviceManager;
  static get instance(): DeviceManager {
    return this._ins || new DeviceManager();
  }
  private _deviceType: 'ios' | 'iPhone' | 'iPad' | 'Android' | 'Windows' | 'unknow' = 'unknow';
  private _deviceTypes: DeviceTypes;
  private _deviceMsg: DeviceMsg;
  constructor() {
    var u = navigator.userAgent;
    if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) this._deviceType = 'ios';
    if (u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1) this._deviceType = 'iPhone';
    if (u.indexOf('iPad') > -1) this._deviceType = 'iPad';
    if (u.indexOf('Android') > -1) this._deviceType = 'Android';
    if (u.indexOf('Windows')) this._deviceType = 'Windows';
    this._deviceTypes = this.getDeviceTypes();
  }

  get type() {
    return this._deviceType;
  }
  get deviceType() {
    return this._deviceTypes || this.getDeviceTypes()
  }
  getDeviceTypes() {
    var u = navigator.userAgent;
    return this._deviceTypes = {
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
      iPad: u.indexOf('iPad') > -1,
      android: u.indexOf('Android') > -1,
      win: u.indexOf('Windows') > -1
    }
  }
}
