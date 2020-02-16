const { MYSQL_CONF } = require("../conf/db");
const mysql = require("mysql");

//创建链接
const con = mysql.createConnection(MYSQL_CONF);

//开始链结
con.connect();

function exec(sql) {
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
  return promise;
}

module.exports = { exec };
