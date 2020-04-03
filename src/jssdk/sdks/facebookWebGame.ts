import Base from "./base"
export default class FbWebGameSdk extends Base{
  type: 3
  constructor(config: ExtendedConfig) {
    super();
    this.initConfig(config);
  }
}