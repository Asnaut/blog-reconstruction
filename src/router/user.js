const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");

const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  console.log(d.toGMTString());
  return d.toGMTString();
};

const handleUserRouter = (req, res) => {
  if (req.method === "POST" && req.path === "/api/user/login") {
    const { username, password } = req.body;
    //const { username, password } = req.query;
    const result = login(username, password);
    return result.then(data => {
      if (data.username) {
        //操作session
        req.session.username = data.username;
        req.session.realname = data.realname;
        return new SuccessModel(data);
      } else {
        return new ErrorModel("登录失败！");
      }
    });
  }

  // //登陆验证
  // if (req.method === "GET" && req.path === "/api/test/login-test") {
  //   if (req.session.username) {
  //     return Promise.resolve(new SuccessModel(req.session));
  //   }
  //   return Promise.resolve(new ErrorModel("尚未登陆"));
  // }
};

module.exports = handleUserRouter;
