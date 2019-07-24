import { TimeManager } from './timeManager'
import { CookieManager } from './cookieManager'
import { DeviceManager } from './deviceManager'

export const Utils = {
  // 暂时不需要操作cookie
  // cookies: CookieManager.instance,
  time(date?: Date) {
    return new TimeManager(date);
  },
  deviceManager: DeviceManager,
  // 根据用户类型和账号类型来做提示
  getAccountType: function (userType: UserType, accountType: AccountType) {
    if (accountType === 2) return "fb";
    if (userType === 0) return "guest";
    return "sdk";
  }
  // 获取查询参数，并保存
}
