export class TimeManager {

  private _date: Date;

  constructor(date: Date = new Date()) {
    this._date = date;
  }

  format(fmt: string) {
    var o = {
      "M+": this._date.getMonth() + 1, //月份
      "d+": this._date.getDate(), //日
      "h+": this._date.getHours(), //小时
      "m+": this._date.getMinutes(), //分
      "s+": this._date.getSeconds(), //秒
      "q+": Math.floor((this._date.getMonth() + 3) / 3), //季度
      "S": this._date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this._date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
}
