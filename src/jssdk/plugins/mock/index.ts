// 使用 Mock
import Mock from "mockjs";
import { getIninSdkRes } from "./init";
import { getloginRes, getregisterRes } from "./login";
import { getVerifyTokenRes, getRoleRes } from "./verifyToken";
import { getCreateOrderRes, getFinishOrderRes, getPaymentConfigRes, getPaymentHistoryRes } from "./payment";
import { getBindVisitorRes, getBindZoneRes, getChangePwdRes, getOperatorEmailRes, getforgetPwdRes } from "./account";

// 初始化
Mock.mock('/api/pocketgames/client/config/v3.1/initSDK', getIninSdkRes);
// 支付
Mock.mock('/api/pocketgames/client/config/paymentConfig/v4.0', getPaymentConfigRes);
Mock.mock('/api/pocketgames/client/order/create/v4.0', getCreateOrderRes);
Mock.mock(/\/api\/pocketgames\/client\/order\/getOrderList\//, getPaymentHistoryRes);
Mock.mock('/api/pocketgames/client/official/order/finish/v4.0', getFinishOrderRes);

// 绑定区服,账号升级,修改密码,找回密码,绑定邮箱
Mock.mock('/api/pocketgames/client/user/v3/bindZone', getBindZoneRes);
Mock.mock('/api/pocketgames/client/user/bindVisitor', getBindVisitorRes);
Mock.mock('/api/pocketgames/client/user/changePwd', getChangePwdRes);
Mock.mock(/\/api\/pocketgames\/client\/user\/forgetPwd.+/, getforgetPwdRes);
Mock.mock('/api/pocketgames/client/user/operatorEmail', getOperatorEmailRes);

// 联运的token校验
Mock.mock('/api/pocketgames/client/user/role', getRoleRes);
// 获取角色信息
Mock.mock('/api/pocketgames/client/quick/verifyToken', getVerifyTokenRes);

// 登录注册
Mock.mock('/api/pocketgames/client/user/v3/login', getloginRes);
Mock.mock('/api/pocketgames/client/user/v3/register', getregisterRes);
