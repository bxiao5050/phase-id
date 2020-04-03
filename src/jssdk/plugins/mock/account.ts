import Mock from "mockjs";
import { getUrlParams } from "../../utils"

const Random = Mock.Random;

export function getBindZoneRes(options) {
  console.log(JSON.stringify({ url: options.url, type: options.type, body: options.body }));
  const result = { code: 200, error_msg: 'success' }
  return result;
}
export function getBindVisitorRes(options) {
  console.log(JSON.stringify({ url: options.url, type: options.type, body: options.body }));
  let body = getUrlParams('?' + options.body);
  const result = {
    code: 200,
    error_msg: 'success',
    token: '',
    data: {
      userId: body.userName,
      userName: body.userName,
      userType: 0,
      accountType: 0,
      email: '',
      emailValid: 1,
      telephone: '',
      firstLogin: 1
    }
  }
  return result;
}
export function getChangePwdRes(options) {
  console.log(JSON.stringify({ url: options.url, type: options.type, body: options.body }));
  const result = {
    "code": 200, "error_msg": "success"
  }
  return result;
}
export function getforgetPwdRes(options) {
  console.log(JSON.stringify({ url: options.url, type: options.type, body: options.body }));
  const result = {
    "code": 200, "error_msg": "success", "data": {
      "userId ": 123321, "userName": "zanans", "emai": "xx @163.com", "phoneNumber": "08421421", "emailValid": 1, "userType": 1, "accountType": 2
    }
  }
  return result;
}
export function getOperatorEmailRes(options) {
  console.log(JSON.stringify({ url: options.url, type: options.type, body: options.body }));
  const result = {
    "code": 200, "error_msg": "success", "data": {
      "userId ": 123321, "userName": "zanans", "emai": "xx @163.com", "phoneNumber": "08421421", "emailValid": 1, "userType": 1, "accountType": 2
    }
  }
  return result;
}
