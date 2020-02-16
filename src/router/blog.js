const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");

const loginCheck = req => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel("尚未登陆"));
  }
};

const handleBLogRouter = (req, res) => {
  if (req.method === "GET" && req.path === "/api/blog/list") {
    const author = req.query.author || "";
    const keyword = req.query.keyword || "";
    //返回promise
    const result = getList(author, keyword);
    return result.then(listData => {
      return new SuccessModel(listData);
    });
  }
  if (req.method === "GET" && req.path === "/api/blog/detail") {
    const id = req.query.id || "";
    const result = getDetail(id);
    return result.then(detaliData => {
      return new SuccessModel(detaliData);
    });
  }
  if (req.method === "POST" && req.path === "/api/blog/new") {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      return loginCheck;
    }
    req.body.author = req.session.username;
    const result = newBlog(req.body);
    return result.then(id => {
      return new SuccessModel(id);
    });
  }
  if (req.method === "POST" && req.path === "/api/blog/update") {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      return loginCheck;
    }
    const result = updateBlog(req.query.id, req.body);
    return result.then(val => {
      if (val) {
        return new SuccessModel();
      } else {
        return new ErrorModel("update fail");
      }
    });
  }
  if (req.method === "POST" && req.path === "/api/blog/delete") {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      return loginCheck;
    }
    const author = req.session.username;
    const result = delBlog(req.query.id, author);
    return result.then(val => {
      if (val) {
        return new SuccessModel();
      } else {
        return new ErrorModel("delete fail");
      }
    });
  }
};

module.exports = handleBLogRouter;
