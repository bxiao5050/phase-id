import Base from '../base';

export default class NativeSdk extends Base {
  type: 2;
  constructor(config: JSSDK.Config) {
    super();
    this.initConfig(config);
  }
}
