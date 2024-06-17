import express from "express";
import moment from "moment-timezone";
import db from "../utils/connect-mysql.js";
import upload from "../utils/upload-imgs.js";

const dateFormat = "YYYY-MM-DD";
const router = express.Router();

const getListData = async (req) => {
  let keyword = req.query.keyword || ""; // 預設值為空字串

  let birthBegin = req.query.birthBegin || ""; // 這個日期之後出生的
  let birthEnd = req.query.birthEnd || ""; // 這個日期之前出生的

  const perPage = 20; // 每頁最多有幾筆
  let page = +req.query.page || 1;
  if (page < 1) {
    return {
      success: false,
      redirect: `?page=1`, // 需要轉向
      info: "page 值太小",
    };
  }

  let where = " WHERE 1 ";
  if (keyword) {
    // where += ` AND \`name\` LIKE ${db.escape("%" + keyword + "%")} `;
    where += ` AND 
    (
      \`member_name\` LIKE ${db.escape(`%${keyword}%`)} 
      OR
      \`mobile\` LIKE ${db.escape(`%${keyword}%`)} 
    )
    `;
  }

  birthBegin = moment(birthBegin);
  if (birthBegin.isValid()) {
    where += ` AND birthday >= '${birthBegin.format(dateFormat)}' `;
  }
  birthEnd = moment(birthEnd);
  if (birthEnd.isValid()) {
    where += ` AND birthday <= '${birthEnd.format(dateFormat)}' `;
  }

  const sql = `SELECT COUNT(*) totalRows FROM member_profile ${where}`;
  const [[{ totalRows }]] = await db.query(sql); // 取得總筆數

  let totalPages = 0; // 總頁數, 預設值設定 0
  let rows = []; // 分頁資料
  if (totalRows > 0) {
    totalPages = Math.ceil(totalRows / perPage);
    if (page > totalPages) {
      return {
        success: false,
        redirect: `?page=${totalPages}`, // 需要轉向
        info: "page 值太大",
      };
    }
// 構造 SQL 查詢語句，根據條件過濾和排序
const sql2 = `
SELECT 
  mp.*, 
  ml.role, 
  ml.status 
FROM 
  member_profile mp
INNER JOIN 
  member_login ml
ON 
  mp.id = ml.member_profile_id AND ml.status = 'active'
${where} 
ORDER BY 
  mp.id 
  DESC LIMIT ${
  (page - 1) * perPage
}, ${perPage} 
`;


    // 執行 SQL 查詢，獲取分頁結果
    [rows] = await db.query(sql2);
    
// 遍歷每一行資料，將生日從 "JS 的 Date 類型" 轉換為日期格式的字串
    rows.forEach((r) => {
      if (r.birthday) {
        r.birthday = moment(r.birthday).format(dateFormat);
      }
      if (r.create_date) {
        r.create_date = moment(r.create_date).format(dateFormat);
      }
    });
  }
  
  return {
    success: true,
    totalRows,
    totalPages,
    page,
    perPage,
    rows,
    qs: req.query,// 原始的查詢參數
  };
};

// router top-level middleware

router.use((req, res, next) => {
  if (req.session.admin) {
    // 如果有登入就讓他通過
    return next();
  }
  let path = req.url.split("?")[0]; // 只要路徑 (去掉 query string)
  // 可通過的白名單
  if (["/", "/api"].includes(path)) {
    return next();
  } 
  // res.status(403).send("<h1>無權訪問此頁面</h1>"); // 直接擋掉
  res.redirect(`/login?u=${req.originalUrl}`); // 導到登入頁
});

router.get("/", async (req, res) => {
  // pageName 名稱 = ab-list
  res.locals.pageName = "ab-list";

  // 調用 getListData 函式
  const result = await getListData(req);

// getListData 返回中包含 redirect 屬性，則重定向 result.redirect 指定路徑。
  if (result.redirect) {
    return res.redirect(result.redirect);
  }
  if (req.session.admin) {
    res.render("member/list", result);
  } else {
    res.render("member/list", result);
  }
});

router.get("/api", async (req, res) => {
  const result = await getListData(req);
  res.json(result);
});

router.get("/add", async (req, res) => {
  res.locals.pageName = "ab-add";
  // 呈現新增資料的表單
  res.render("member/add");
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

// 比較符合 RESTful API 的寫法
router.delete("/:id", async (req, res) => {
  const output = {
    success: false,
    result: {},
  };
  let id = +req.params.id || 0;
  if (id) {
    const sql = `DELETE FROM member_profile WHERE id=${id}`;
    const [result] = await db.query(sql);
    output.result = result;
    output.success = !!result.affectedRows;
  }
  res.json(output);
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
