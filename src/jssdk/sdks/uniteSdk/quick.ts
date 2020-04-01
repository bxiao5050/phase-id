import Base from "../base"

export default class QuickSdk extends Base{
  type: 5
  constructor(config: JSSDK.Config) {
    super();
    this.initConfig(config);
  }
}