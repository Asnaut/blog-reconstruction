const { exec } = require("../db/mysql");

const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1`;
  if (author) {
    //``可以实现拼接字符串 ES6
    sql += ` and author ='${author}'`;
  }
  if (keyword) {
    sql += ` and title like '%${keyword}%'`;
  }
  //sql += `order by createtime desc;`;
  return exec(sql);
};

const getDetail = id => {
  let sql = `select * from blogs where id  = '${id}';`;
  return exec(sql).then(rows => {
    return rows[0];
  });
};

//如果数据为空，返回一个全新的id
const newBlog = (blogData = {}) => {
  const title = blogData.title;
  const content = blogData.content;
  const author = blogData.author;
  const createTime = Date.now();
  const sql = `insert into blogs (title,content,author,createtime)
  values ('${title}','${content}','${author}',${createTime})`;
  return exec(sql).then(insertData => {
    return {
      id: insertData.insertId
    };
  });
};

const updateBlog = (id, blogData = {}) => {
  const title = blogData.title;
  const content = blogData.content;

  const sql = `update blogs set title='${title}', content= '${content}' where id = ${id};`;
  return exec(sql).then(updateData => {
    if (updateData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

const delBlog = (id, author) => {
  //TODO
  const sql = `delete from blogs where id =${id} and author = '${author}'; `;
  return exec(sql).then(delData => {
    if (delData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};
module.exports = { getList, getDetail, newBlog, updateBlog, delBlog };
