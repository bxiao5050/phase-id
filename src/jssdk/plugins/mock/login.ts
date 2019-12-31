import Mock from "mockjs";
import { getUrlParam } from "../../common/utils"

const Random = Mock.Random;

export function getloginRes(options) {
  console.log(JSON.stringify({ url: options.url, type: options.type, body: options.body }));
  let body = getUrlParam('?' + options.body);
  const result = {
    code: 200,
    error_msg: 'success',
    token: Mock.mock({ 'regexp|3': /\d{5,10}\-/ }).regexp,
    data: {
      userId: Random.integer(6730001, 6731000),
      userName: body.userName,
      userType: body.userType,
      accountType: body.accountType,
      email: '',
      emailValid: 1,
      telephone: '',
      firstLogin: 1
    }
  }
  return result;
}
export function getregisterRes(options) {
  console.log(JSON.stringify({ url: options.url, type: options.type, body: options.body }));
  let userName = getUrlParam('?' + options.body).userName;
  let result;
  if (userName) {
    result = {
      code: 200,
      error_msg: 'success',
      token: Mock.mock({ 'regexp|3': /\d{5,10}\-/ }).regexp,
      data: {
        userId: Random.integer(6730001, 6731000),
        userName: 'formal',
        userType: 1,
        accountType: 1,
        email: '',
        emailValid: 1,
        telephone: '',
        firstLogin: 1
      }
    }
  } else {
    result = {
      code: 200,
      error_msg: 'success',
      token: Mock.mock({ 'regexp|3': /\d{5,10}\-/ }).regexp,
      data: {
        userId: Random.integer(6730001, 6731000),
        userName: 'visitor',
        userType: 0,
        accountType: 1,
        email: '',
        emailValid: 1,
        telephone: '',
        firstLogin: 1
      }
    }
  }

  return result;
}
