import express from 'express';
const router = express.Router();

// 管理員首頁
router.get('/home', (req, res) => {
  // 檢查是否有登入，以及角色是否為 admin
  if (req.session.role !== 'admin') {
    return res.redirect('/ago-index/login');
  }
  // 渲染管理員首頁
  res.render('member/member-home');
});

export default router;
