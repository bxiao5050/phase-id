window.$postMessage = function(param: {
  action: string;
  data: {
    user: any;
    users: any;
    param: any;
    name: string;
  };
}) {
  if (param.action === "get") {
    const data = {
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : "",
      users: localStorage.getItem("users")
        ? JSON.parse(localStorage.getItem("users"))
        : {}
    };
    RG.jssdk.Account.init(data);
  } else if (param.action === "set") {
    localStorage.setItem("user", JSON.stringify(param.data.user));
    localStorage.setItem("users", JSON.stringify(param.data.users));
  } else if (param.action === "mark") {
    // param.data.param
    //   ? RG.Mark(param.data.name, param.data.param)
    //   : RG.Mark(param.data.name);
  }
};

export {};
