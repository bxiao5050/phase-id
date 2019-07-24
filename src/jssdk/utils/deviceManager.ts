export class DeviceManager {

  private _deviceType: 'ios' | 'iPhone' | 'iPad' | 'Android' | 'Windows' | 'unknow' = 'unknow';
  private _deviceMsg: DeviceMsg;
  constructor() {
    var u = navigator.userAgent;
    if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) this._deviceType = 'ios';
    if (u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1) this._deviceType = 'iPhone';
    if (u.indexOf('iPad') > -1) this._deviceType = 'iPad';
    if (u.indexOf('Android') > -1) this._deviceType = 'Android';
    if (u.indexOf('Windows')) this._deviceType = 'Windows';
  }

  get type() {
    return this._deviceType;
  }
}
