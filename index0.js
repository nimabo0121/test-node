// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

import express from "express";
import multer from "multer";

import agoIndexRouter from './routes/ago-index.js';
import memberHomeRouter from './routes/member-home.js';
import userHomeRouter from './routes/user-home.js';

// 路徑： 相對於當前文件的 ./data/sales.js。
// 功能： 引入了自定義的 sales 數據，可能是用於應用程序中的測試數據或固定配置。
import sales from "./data/sales.js";

// zod 模組
import { z } from "zod";

// node 模組 功能： CORS (Cross-Origin Resource Sharing) 是一種機制，用於允許不同來源之間的瀏覽器對資源進行跨域請求的控制。
import cors from "cors";

// Node.js 模組 功能： Bcrypt 是一個用於加密散列密碼的庫，常用於在應用程序中存儲和驗證使用者密碼。
import bcrypt from "bcrypt";

// const upload = multer({ dest: "tmp_uploads/" });
// 當前文件的 ./utils/upload-imgs.js。
// 自定義的文件上傳工具，用於處理應用程序中的文件上傳需求。
// import upload from "./utils/upload-imgs.js";

//  相對於當前文件的 ./routes/admin.js。
// 引入了自定義的路由模組，用於處理應用程序中與管理員相關的路由。
import admin2Router from "./routes/admin2.js";

// 當前文件的 ./routes/address-book.js。
// 地址簿相關的路由。
import memberRouter from "./routes/member.js";
import agoRouter from "./routes/ago-index.js";

//  Node.js 模組
// Express Session 是一個 Express 中間件，用於管理會話（session）狀態和存儲會話數據。
import session from "express-session";

// Node.js 模組
// Express MySQL Session 是一個 Express Session 的 MySQL 存儲引擎，用於將會話數據存儲到 MySQL 數據庫中。
import mysql_session from "express-mysql-session";

// import moment from "moment-timezone";

// 當前文件的 ./utils/connect-mysql.js。
// 自定義的 MySQL 數據庫連接模組，用於在應用程序中與 MySQL 數據庫建立連接和進行數據操作。
import db from "./utils/connect-mysql.js";

// 創建了一個新的 Express 應用程序。
const app = express();

// 使用了 express-mysql-session 模組來將 Express 會話（session）存儲到 MySQL 數據庫中。
const MysqlStore = mysql_session(session);

// sessionStore： 是創建的實際會話存儲對象，通過 MysqlStore 的實例化來初始化，並使用 db 對象作為數據庫連接。
const sessionStore = new MysqlStore({}, db);

// Express 在渲染模板時會以 .ejs 結尾的文件
app.set("view engine", "ejs");
app.set('views', './views');
// Top-level middlewares---------------------------------
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    // console.log({ origin });
    callback(null, true); // 允許所有網站取得資源
  },
};
app.use(cors(corsOptions));
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
app.use('/ago-index', agoIndexRouter);
app.use('/member-home', memberHomeRouter);
app.use('/user', userHomeRouter);
app.use("/login", agoRouter);
app.use("/admins", admin2Router);
app.use("/member", memberRouter);

// ******************* 自訂 top-level middleware----------------------
app.use((req, res, next) => {
  // res.send("<p>直接被中斷</p>"); // 不應該回應

  // 將 req.session 設置為 res.locals.session，使得模板引擎可以直接通過 session 變數訪問和顯示會話中的數據。
  res.locals.session = req.session; 

  // 設置一個預設的頁面標題，以確保每個頁面都有一致的標題。
  res.locals.title = "牡丹樓"; // 預設的頁面 title

  // res.locals.pageName = "";： 初始化了一個 pageName 變數
  res.locals.pageName = "";
  next();
});

// 路由設定, routes
// 1. get(): 只接受 HTTP GET 方法的拜訪
// 2. 只接受 路徑為 / 的 request
app.get("/", (req, res) => {
  // res.send("<h2>Hello World</h2>");
  res.render("member", { name: "牡丹樓" });
});

app.get("/json-sales", (req, res) => {
  res.locals.title = "JSON-SALES | " + res.locals.title;
  res.locals.pageName = "json-sales";

  // 輸出 application/json 的格式
  // res.json(salesArray);

  res.render("json-sales", { sales });
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

// middleware: 中介軟體, 中介處理函式-----------------------
// const urlencodedParser = express.urlencoded({extended: true});
app.post("/try-post-form", (req, res) => {
  res.render("try-post-form", req.body);
});

app.post("/try-post", (req, res) => {
  res.json(req.body);
});

// // 測試上傳單一個欄位單一個檔案
// app.post("/try-upload", upload.single("avatar"), (req, res) => {
//   res.json({
//     file: req.file,
//     body: req.body,
//   });
// });
// // 測試上傳單一個欄位多個檔案
// app.post("/try-uploads", upload.array("photos", 10), (req, res) => {
//   res.json(req.files);
// });

// // 特定的路徑放前面
// app.get("/my-params1/abcd", (req, res) => {
//   res.json({ path: "/my-params1/abcd" });
// });


// router top-level middleware-------------------------

// router.use((req, res, next) => {
//   if (req.session.admin) {
//     // 如果有登入就讓他通過
//     return next();
//   }
//   let path = req.url.split("?")[0]; // 只要路徑 (去掉 query string)
//   // 可通過的白名單
//   if (["/", "/api"].includes(path)) {
//     return next();
//   } 
//   // res.status(403).send("<h1>無權訪問此頁面</h1>"); // 直接擋掉
//   res.redirect(`/login?u=${req.originalUrl}`); // 導到登入頁
// });

// router.get("/", async (req, res) => {
//   // pageName 名稱 = ab-list
//   res.locals.pageName = "ab-list";

//   // 調用 getListData 函式
//   const result = await getListData(req);

// // getListData 返回中包含 redirect 屬性，則重定向 result.redirect 指定路徑。
//   if (result.redirect) {

//     return res.redirect(result.redirect);
//   }
//   // 如果身分user
//   if (req.session.admin) {
//     res.render("ago-home", result);
//   } else {
//     // 如果身分為admin
//     res.render("member-home", result);
//   }
// });




app.get("/try-sess", (req, res) => {
  // req.session.my_num = req.session.my_num || 0;
  req.session.my_num ||= 0;
  req.session.my_num++;
  res.json(req.session);
});

// app.get("/try-moment", (req, res) => {
//   const fm = "YYYY-MM-DD HH:mm:ss";
//   const m1 = moment(); // 取得當下時間的 moment 物件
//   const m2 = moment("2024-02-29");
//   const m3 = moment("2023-02-29");

//   res.json({
//     m1: m1.format(fm),
//     m2: m2.format(fm),
//     m3: m3.format(fm),
//     m1v: m1.isValid(), // 是不是有效的日期
//     m2v: m2.isValid(),
//     m3v: m3.isValid(),
//     m1z: m1.tz("Europe/London").format(fm),
//     m2z: m2.tz("Europe/London").format(fm),
//   });
// });

// 測試表單
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

// // zod 信箱驗證
// app.get("/zod2/:index?", async (req, res) => {
//   const index = +req.params.index || 0;
//   const schema = z.object({
//     account: z.string().email({ message: "錯誤的 email 格式" }),
//     password: z.string().min(6, "最少 6 個字元").max(20, "最多 20 個字元"),
//   });
//   const ar = [
//     {
//       account: "shinder",
//       password: "12345",
//     },
//     {
//       account: "shinder@test.com",
//       password: "12345398453984598sjhfsjfj3845",
//     },
//     {
//       account: "shinder@test.com",
//       password: "123fsjfj3845",
//     },
//   ];
//   const result = schema.safeParse(ar[index]);
//   res.json(result);
// });


app.get("/login", async (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const output = {
    success: false,
    code: 0,
  };

  const sql = "SELECT * FROM member_login WHERE account=?";
  const [rows] = await db.query(sql, [req.body.account]);

  if (!rows.length) {
    output.code = 400; // 帳號是錯的
    return res.json(output);
  }
  const row = rows[0];
  const result = await bcrypt.compare(req.body.password, row.password);
  if (result) {
    output.success = true;
    output.code = 200;

    // 登入成功, 狀態記錄在 session 裡
    req.session.admin = {
      id: row.id,
      role: row.role,
      account: row.account,
      nickname: row.nickname,
    };
  } else {
    output.code = 430; // 密碼是錯的
  }

  res.json(output);
});
// 登出
app.get("/logout", async (req, res) => {
  delete req.session.admin;
  res.redirect("/");
});
// // ***** 測試用: 快速登入
// app.get("/q/:mid", async (req, res) => {
//   const mid = +req.params.mid || 0;

//   const sql = `SELECT id, email, nickname FROM members WHERE id=${mid}`;
//   const [rows] = await db.query(sql);
//   if (rows.length) {
//     req.session.admin = rows[0];
//     return res.json({ success: true, ...rows[0] });
//   }
//   res.json({ success: false });
// });

// ************* 設定靜態內容資料夾 *************
// 當訪問 /styles.css 時，Express 將嘗試在 public/styles.css 中查找這個文件。
app.use(express.static("public")); 
// Express 將在本地文件系統中尋找並提供 "node_modules/bootstrap/dist" 目錄下的相應文件。
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));
app.use("/bootstrap", express.static("public/img"));

// ************* 放在所有路由的後面 *************
// 404 頁面
app.use((req, res) => {
  res.status(404).send("<h1>您走錯路了</h1>");
});

const port = process.env.WEB_PORT || 3002;
app.listen(port, () => {
  console.log(`伺服器啟動了, port: ${port}`);
});
