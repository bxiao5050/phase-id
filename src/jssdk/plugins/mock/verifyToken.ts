import Mock from "mockjs";

const Random = Mock.Random;

export function getRoleRes(options) {
  console.log(JSON.stringify({ url: options.url, type: options.type, body: options.body }));
  const result = {}
  return result;
}
export function getVerifyTokenRes(options) {
  console.log(JSON.stringify({ url: options.url, type: options.type, body: options.body }));
  const result = {
    "code": 200,
    "error_msg": "success"
  }
  return result;
}
