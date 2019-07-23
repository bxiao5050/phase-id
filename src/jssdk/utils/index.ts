import { TimeManager } from './timeManager'
import { CookieManager } from './cookieManager'
import { DeviceManager } from './deviceManager'

export const utils = {
  cookies: CookieManager.instance,
  time(date?: Date) {
    return new TimeManager(date);
  }
}
