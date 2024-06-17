import express from 'express';
const router = express.Router();

// 一般用戶首頁
router.get('/home', (req, res) => {
  // 檢查是否有登入，以及角色是否為 user
  if (req.session.role !== 'user') {
    return res.redirect('/ago-index/login');
  }
  // 渲染一般用戶首頁
  res.render('user/user-home');
});

export default router;
