window.$postMessage = function (paramsStr: string) {
  const param = JSON.parse(paramsStr) as {
    action: string;
    data: {
      user: any;
      users: any;
      param: any;
      name: string;
    };
  }
  if (param.action === "get") {
    const data = {
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : "",
      users: localStorage.getItem("users")
        ? JSON.parse(localStorage.getItem("users"))
        : {}
    };
    console.info('get User Users', data)
    RG.jssdk.Account.init(data);
  } else if (param.action === "set") {
    console.info('set User Users', param.data)
    localStorage.setItem("user", JSON.stringify(param.data.user));
    localStorage.setItem("users", JSON.stringify(param.data.users));
  } else if (param.action === "mark") {
    console.info(`markName: ${param.data.name}`);
  }
};

export { };
