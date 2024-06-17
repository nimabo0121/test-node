// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

import express from "express";
import multer from "multer";
import sales from "./data/sales.js";
import { z } from "zod";
import cors from "cors";
import bcrypt from "bcrypt";
// const upload = multer({ dest: "tmp_uploads/" });
import upload from "./utils/upload-imgs.js";
import admin2Router from "./routes/admin2.js";
// import noRouter from "./routes/no-index.js";
import abRouter from "./routes/member.js";
import agoRouter from "./routes/ago-index.js";
// import cart2Router from "./routes/cart2.js";
import session from "express-session";
import mysql_session from "express-mysql-session";
import moment from "moment-timezone";

import db from "./utils/connect-mysql.js";

const app = express();
const MysqlStore = mysql_session(session);
const sessionStore = new MysqlStore({}, db);

app.set("view engine", "ejs");

// Top-level middlewares
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    // console.log({ origin });
    callback(null, true); // 允許所有網站取得資源
  },
};
app.use(cors(corsOptions));
// express 中間件
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    // name: 'super.mario', // cookie (session id) 的名稱
    secret: "dgdjk398475UGJKGlkskjhfskjf",
    store: sessionStore,
    // cookie: {
    //  maxAge: 1200_000
    // }
  })
);

// ******************* 自訂 top-level middleware
app.use((req, res, next) => {
  // res.send("<p>直接被中斷</p>"); // 不應該回應
  res.locals.session = req.session; // 是讓 template 可以使用(讀取) session
  res.locals.title = "牡丹樓"; // 預設的頁面 title
  res.locals.pageName = "";
  next();
});

app.get("/json-sales", (req, res) => {
  res.locals.title = "JSON-SALES | " + res.locals.title;
  res.locals.pageName = "json-sales";

  // 輸出 application/json 的格式
  // res.json(salesArray);

  res.render("json-sales", { sales });
});


// app.get("/", (req, res) => {
//   // res.send("<h2>Hello World</h2>");
//   res.render("no-home", { name: "noRouter" });
// });


app.get("/", (req, res) => {
  // res.send("<h2>Hello World</h2>");
  res.render("ago-home", { name: "ago-index" });
});

// 路由設定, routes
// 1. get(): 只接受 HTTP GET 方法的拜訪
// 2. 只接受 路徑為 / 的 request
app.get("/", (req, res) => {
  // res.send("<h2>Hello World</h2>");
  res.render("member", { name: "member" });
});  



// 測試 query string 參數
app.get("/try-qs", (req, res) => {
  res.json(req.query);
});

app.get("/try-post-form", (req, res) => {
  res.locals.title = "測試表單 | " + res.locals.title;
  res.locals.pageName = "tpf";
  // res.render("try-post-form", { account: "", password: "" });
  res.render("try-post-form");
});

// middleware: 中介軟體, 中介處理函式
// const urlencodedParser = express.urlencoded({extended: true});
app.post("/try-post-form", (req, res) => {
  res.render("try-post-form", req.body);
});

app.post("/try-post", (req, res) => {
  res.json(req.body);
});

// 測試上傳單一個欄位單一個檔案
app.post("/try-upload", upload.single("avatar"), (req, res) => {
  res.json({
    file: req.file,
    body: req.body,
  });
});
// 測試上傳單一個欄位多個檔案
app.post("/try-uploads", upload.array("photos", 10), (req, res) => {
  res.json(req.files);
});

// 特定的路徑放前面
app.get("/my-params1/abcd", (req, res) => {
  res.json({ path: "/my-params1/abcd" });
});
// 路徑參數
app.get("/my-params1/:action?/:id?", (req, res) => {
  res.json(req.params);
});

app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
  let u = req.url.split("?")[0]; // 只要 ? 前面那段
  u = u.slice(3); // 前面的三個字元不要
  u = u.split("-").join("");

  res.json({ 手機: u });
});

app.use("/admins", admin2Router);
app.use("/ago-index", agoRouter);
app.use("/member", abRouter);
// app.use("/no-index", noRouter);
// app.use("/cart2", cart2Router);

app.get("/try-sess", (req, res) => {
  // req.session.my_num = req.session.my_num || 0;
  req.session.my_num ||= 0;
  req.session.my_num++;
  res.json(req.session);
});

app.get("/try-moment", (req, res) => {
  const fm = "YYYY-MM-DD HH:mm:ss";
  const m1 = moment(); // 取得當下時間的 moment 物件
  const m2 = moment("2024-02-29");
  const m3 = moment("2023-02-29");

  res.json({
    m1: m1.format(fm),
    m2: m2.format(fm),
    m3: m3.format(fm),
    m1v: m1.isValid(), // 是不是有效的日期
    m2v: m2.isValid(),
    m3v: m3.isValid(),
    m1z: m1.tz("Europe/London").format(fm),
    m2z: m2.tz("Europe/London").format(fm),
  });
});

app.get("/try-db", async (req, res) => {
  const sql = "SELECT * FROM member_login LIMIT 31";
  //const [rows, fields] = await db.query(sql);
  const [rows] = await db.query(sql);
  res.json(rows);
});

// zod 套件測試
app.get("/zod-email/:email", async (req, res) => {
  const emailSchema = z.string().email({ message: "錯誤的 email 格式" });
  const result = emailSchema.safeParse(req.params.email);

  res.json(result);
});
app.get("/zod2/:index?", async (req, res) => {
  const index = +req.params.index || 0;
  const schema = z.object({
    account: z.string().email({ message: "錯誤的 email 格式" }),
    password: z.string().min(6, "最少 6 個字元").max(20, "最多 20 個字元"),
  });
  const ar = [
    {
      account: "shinder",
      password: "12345",
    },
    {
      account: "shinder@test.com",
      password: "12345398453984598sjhfsjfj3845",
    },
    {
      account: "shinder@test.com",
      password: "123fsjfj3845",
    },
  ];
  const result = schema.safeParse(ar[index]);
  res.json(result);
});
const router = express.Router();

app.get("/login", async (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  const output = {
    success: false,
    code: 0,
  };

  const sql = "SELECT * FROM member_profile WHERE email=?";
  const [rows] = await db.query(sql, [req.body.email]);

  if (!rows.length) {
    output.code = 400; // 帳號是錯的
    return res.json(output);
  }
  const row = rows[0];
  const result = await bcrypt.compare(req.body.password, row.password);

  if (result) {
    // 登入成功
    output.success = true;
    output.code = 200;
    output.role = row.role; // 設置用戶的角色
    output.id = row.id;
    output.email = row.email;
    output.member_name = row.member_name;
    req.session.admin = {
      role: row.role,
      id: row.id,
      email: row.email,
      member_name: row.member_name,
    };
  } else {
    output.code = 430; // 密碼錯誤
  }

  res.json(output);
});


// router top-level middleware

// 中間件：路由保護
const ADMIN_ROLE = "admin";

app.use((req, res, next) => {
  // 檢查是否有會話和是否有 admin 角色
  if (req.session.admin) {
    // 如果有登入且角色是 admin，允許進入
    return next();
  }

  // 可以訪問的白名單路徑
  const whitelist = ["/", "/api"];
  let path = req.url.split("?")[0]; // 只保留路徑部分，去掉 query string

  if (whitelist.includes(path)) {
    return next();
  }

  // 其他情況重定向到登入頁面
  res.redirect(`/login?u=${req.originalUrl}`);
});

// 首頁路由
app.get("/", async (req, res) => {
  res.locals.pageName = "ago-list"; // 設置頁面名稱

  const result = await getListData(req);

  if (result.redirect) {
    return res.redirect(result.redirect);
  }

  // 根據角色決定渲染的模板
  if (req.session.admin.role === ADMIN_ROLE) {
    res.render("member", result); // 管理員的頁面
  } else {
    res.render("ago-index", result); // 一般用戶的頁面
  }
});

// // 載入路由
// app.use("/member", require("./routes/member"));
// app.use("/ago-index", require("./routes/ago-index"));


// 登出
app.get("/logout", async (req, res) => {
  delete req.session.admin;
  res.redirect("/");
});

// app.get("/yahoo", async (req, res) => {
//   const r = await fetch("https://tw.yahoo.com/");
//   const txt = await r.text();
//   res.send(txt);
// });

// ***** 測試用: 快速登入
app.get("/q/:mid", async (req, res) => {
  const mid = +req.params.mid || 0;

  const sql = `SELECT id, email, nickname FROM member_profile WHERE id=${mid}`;
  const [rows] = await db.query(sql);
  if (rows.length) {
    req.session.admin = rows[0];
    return res.json({ success: true, ...rows[0] });
  }
  res.json({ success: false });
});

// ************* 設定靜態內容資料夾 *************
app.use(express.static("public"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));

// ************* 放在所有路由的後面 *************
// 404 頁面
app.use((req, res) => {
  res.status(404).send("<h1>您走錯路了</h1>");
});

const port = process.env.WEB_PORT || 3002;
app.listen(port, () => {
  console.log(`伺服器啟動了, port: ${port}`);
});
