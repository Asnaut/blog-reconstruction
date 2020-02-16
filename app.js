const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");
const Url = require("url");
const { access } = require("./src/utils/log");

const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  console.log(d.toGMTString());
  return d.toGMTString();
};

//session
const SESSION_DATA = {};

const getPostData = req => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== "POST") {
      resolve({});
      return;
    }
    if (req.headers["content-type"] !== "application/json") {
      resolve({});
      return;
    }
    let postData = "";

    req.on("data", chunk => {
      postData += chunk.toString();
    });
    req.on("end", () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(JSON.parse(postData));
    });
  });
  return promise;
};

const serverHandler = (req, res) => {
  //记录日志
  access(
    `${req.method} -- ${req.url} -- ${
      req.headers["user-agent"]
    } -- ${Date.now()}`
  );

  //设置返回格式JSON
  res.setHeader("Content-type", "application/json");

  //参数
  const urlObj = Url.parse(req.url, true);
  req.path = urlObj.pathname;

  //解析query
  req.query = urlObj.query;

  //解析cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || "";
  cookieStr.split(";").forEach(item => {
    if (!item) {
      return;
    }
    const arr = item.split("=");
    const key = arr[0].trim();
    const value = arr[1].trim();
    req.cookie[key] = value;
  });

  //处理session
  let userId = req.cookie.userid;
  let needSetCookie = false;
  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {};
    }
  } else {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    SESSION_DATA[userId] = {};
  }
  req.session = SESSION_DATA[userId];
  //处理post
  getPostData(req).then(postData => {
    //有作用域！！！
    //异步的
    req.body = postData;
    const blogResult = handleBlogRouter(req, res);
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          res.setHeader(
            "Set-Cookie",
            `userid=${userId}; path=/; httpOnly; expires = ${getCookieExpires()} `
          );
        }
        res.end(JSON.stringify(blogData));
      });
      return;
    }

    const userResult = handleUserRouter(req, res);
    if (userResult) {
      userResult.then(userData => {
        //若生成userid 写入cookie
        if (needSetCookie) {
          res.setHeader(
            "Set-Cookie",
            `userid=${userId}; path=/; httpOnly; expires = ${getCookieExpires()} `
          );
        }
        res.end(JSON.stringify(userData));
      });
      return;
    }

    res.writeHead(404, { "Content-type": "text/plain" });
    res.write("404 NOT FOUND\n");
    res.end();
  });
};

module.exports = serverHandler;
