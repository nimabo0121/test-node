import express from "express";
// import moment from "moment-timezone";
import db from "../utils/connect-mysql.js";
import upload from "../utils/upload-imgs.js";

const dateFormat = "YYYY-MM-DD";
const router = express.Router();


  // birthBegin = moment(birthBegin);
  // if (birthBegin.isValid()) {
  //   where += ` AND birthday >= '${birthBegin.format(dateFormat)}' `;
  // }
  // birthEnd = moment(birthEnd);
  // if (birthEnd.isValid()) {
  //   where += ` AND birthday <= '${birthEnd.format(dateFormat)}' `;
  // }

// // 構造 SQL 查詢語句，根據條件過濾和排序
// const sql2 = `
// SELECT 
//   mp.*, 
//   ml.role, 
//   ml.status 
// FROM 
//   member_profile mp
// INNER JOIN 
//   member_login ml
// ON 
//   mp.id = ml.member_profile_id AND ml.status = 'active'
// ${where} 
// ORDER BY 
//   mp.id 
//   DESC LIMIT ${
//   (page - 1) * perPage
// }, ${perPage} 
// `;




router.get("/api", async (req, res) => {
  const result = await getListData(req);
  res.json(result);
});

router.get("/add", async (req, res) => {
  res.locals.pageName = "ab-add";
  // 呈現新增資料的表單
  res.render("ago-index/add");
});

router.post("/add", upload.none(), async (req, res) => {
  const output = {
    success: false,
    bodyData: req.body,
    result: {},
  };
  // 處理表單資料

  // TODO: 欄位資料檢查

  /*
  const sql = `INSERT INTO member_profile 
  ( name, email, mobile, birthday, address, created_at) VALUES (
    ?, ?, ?, ?, ?, NOW()
  )`;

  const [result] = await db.query(sql, [
    req.body.name,
    req.body.email,
    req.body.mobile,
    req.body.birthday,
    req.body.address,
  ]);
  */
  const sql2 = `INSERT INTO member_profile set ?`;
  // data 物件的屬性, 對應到資料表的欄位
  const data = { ...req.body, created_at: new Date() };

  data.birthday = moment(data.birthday);
  if (data.birthday.isValid()) {
    // 如果是正確的格式
    data.birthday = data.birthday.format(dateFormat);
  } else {
    // 不是正確的日期格式, 就使用空值
    data.birthday = null;
  }
  try {
    const [result] = await db.query(sql2, [data]);
    output.result = result;
    output.success = !!result.affectedRows;
  } catch (ex) {
    // sql 發生錯誤
    output.error = ex; // 開發時期除錯
  }
  res.json(output);
  /*
{
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 1011,
    "info": "",
    "serverStatus": 2,
    "warningStatus": 0,
    "changedRows": 0
}
*/
});


// 呈現修改資料的表單
router.get("/edit/:id", async (req, res) => {
  // TODO: 欄位資料檢查

  let id = +req.params.id || 0;
  if (!id) {
    return res.redirect("/member");
  }
  const sql = `SELECT * FROM member_profile WHERE id=${id}`;
  const [rows] = await db.query(sql);
  if (rows.length === 0) {
    // 沒有該筆資料時, 跳回列表頁
    return res.redirect("/member");
  }

  const row = rows[0];
  if (row.birthday) {
    // 日期格式轉換
    row.birthday = moment(row.birthday).format(dateFormat);
  }

  res.render("member/edit", row);
});
// 處理修改資料的表單
router.put("/edit/:id", upload.none(), async (req, res) => {
  const output = {
    success: false,
    bodyData: req.body,
    result: null,
  };

  let id = +req.params.id || 0;
  if (!id) {
    return res.json({ success: false, info: "不正確的主鍵" });
  }
  const sql = "UPDATE member_profile SET ? WHERE id=?";
  const [result] = await db.query(sql, [req.body, id]);

  output.result = result;
  output.success = !!(result.affectedRows && result.changedRows);

  res.json(output);
});
export default router;
