// import WebSdk from "./web";
import NativeSdk from './native';
// import WebSdk from "./facebookInstantGame";
// import WebSdk from "./facebookWebGame";
// import QuickSdk from "./uniteSdk/quick";
import {GamePayParams} from './base';

interface RG {
  type: number;
  // jssdk: NativeSdk;
  CurUserInfo(): any;
  BindZone(params: BindZoneParam): Promise<ServerRes>;
  Pay(params: GamePayParams): void;
  Share(): Promise<ServerRes>;
  Mark(): void;
  Install(): void;
  Redirect(): void;
  ChangeAccount(): Promise<any>;
}

export function initRG(sdk: NativeSdk) {
  function RgFunciton(this: RG) {
    this.type = sdk.type;
    this.CurUserInfo = function() {
      const {userId, userName, token} = sdk.account.user;
      return {userId, userName, token};
    };
    this.BindZone = function(params: BindZoneParam) {
      return sdk.bindZone(params);
    };
    this.Pay = function(params: GamePayParams) {
      sdk.getPaymentInfo(params);
    };
    // this.Share = function() {};
    this.Mark = function() {};
    if (sdk.install) {
      this.Install = function() {
        sdk.install();
      };
    }
    this.Redirect = function() {
      sdk.redirect();
    };
    this.ChangeAccount = function() {
      return Promise.resolve();
    };
  }
  RgFunciton.prototype.jssdk = sdk;
  window.RG = new RgFunciton();
}
