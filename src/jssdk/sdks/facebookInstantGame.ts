import Base from "./base"
export default class FbInstantGameSdk extends Base{
  type: 4
  constructor(config: Config) {
    super();
    this.initConfig(config);
  }
}