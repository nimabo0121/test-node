import express from "express";

const router = express.Router();

router.get("/:p1?/:p2?", (req, res) => {
  res.json({
    params: req.params,
    url: req.url,
    baseUrl: req.baseUrl, // 掛進來的前面那段路徑
    originalUrl: req.originalUrl, // 完整的路徑 (包含 query string)
  });
});

export default router;
