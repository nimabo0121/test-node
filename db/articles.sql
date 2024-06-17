-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-05-08 14:29:19
-- 伺服器版本： 8.0.36
-- PHP 版本： 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `mudanlow`
--

-- --------------------------------------------------------

--
-- 資料表結構 `articles`
--

CREATE TABLE `articles` (
  `a_id` int NOT NULL,
  `date` date DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `photos` varchar(255) DEFAULT NULL,
  `content` text,
  `key_word_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 傾印資料表的資料 `articles`
--

INSERT INTO `articles` (`a_id`, `date`, `title`, `photos`, `content`, `key_word_id`) VALUES
(2, '2023-05-20', '一歲可愛英國長毛貓認養', '[\"84c6675af251497efd0d469ed82de858ee82d044.jpg\"]', '英國長毛貓\r\n年齡:1歲\r\n花色:白毛帶一點棕\r\n領養電話:09xxxxxxxxx\r\n已結紮', 5),
(3, '2024-02-18', '過年公休', '[\"9a604e9982cb957ca8f93e8f9c550c6c7e02102e.jpg\"]', '年後 休假公告 💕\r\n忙完大家的過年菜\r\n換我們休大假囉 💗\r\n2/19（一）～2/22（四）\r\n連休四天\r\n過個年 嘴兒嚐甜甜 …\r\n甜點🍮 大爆發 \r\n🍧杏仁涼豆腐\r\n🍨花生涼豆花', 4),
(4, '2024-04-11', '經濟午餐新菜單', '[\"500f32d2f5c792d9c8e47a23734cc9cecbc6bd74.jpg\"]', '牡丹樓 「午間定食套餐 」🍱 上架囉 💕\r\n8週年開幕慶🎉 「商業定食套餐」\r\n2人成行\r\n留下美美 照片 打卡分享上傳 iG 或 FB \r\n享 每桌 2 人同享 1人免費 一次\r\n煩請來電預約專線：\r\n06-2217509\r\n💕活動期間 即日起 ～ 4月底💕', 2),
(5, '2024-05-08', '《牡丹樓 翻新夜 | 香檳氣泡 醉中菜 | 醐閣》', '[\"a00a69b316c803bc963b3c9e36060f7e2dec74c4.jpg\"]', '嗨～ 大家好 💗\r\n5/17（五）\r\n5/17（五）\r\n5/17（五）\r\n想參加的 快跟我們說💕\r\n這整場幾乎是闆娘愛的 香檳、氣泡\r\n挑香檳功力也極好\r\n其中更有大愛的 西班牙頂款CAVA\r\n餐 搭 酒 🍷 每位$2950/位\r\n——————————————————————\r\n《牡丹樓 翻新夜 | 香檳氣泡 醉中菜 | 醐閣》\r\n.\r\n⚠️【氣泡的氣度 & 中菜的多變】\r\n各種菜系的餐酒搭配這件事情來說，中菜算是難中之難，多變的醬汁，台灣特有的複雜融合菜系，還有那堪稱奇蹟的上菜速度!! 都不是多數葡萄酒能信手拈來的。\r\n.\r\n葡萄酒款中，氣泡酒 (包含香檳)，是少數中能相對輕鬆應對各大菜系的常勝軍，醐閣 這次要與近期翻新裝潢的 『台南饕客老店 - 牡丹樓』，來場 【有氣度】 的台南在地中菜餐酒會!', 3),
(6, '2024-03-04', '更名牡丹樓!!!!!!', '[\"ed1f893dd1068f396ca5002ae0663f8ab157779d.jpg\"]', '日安 吾友們 在此問好💕\r\n要跟大家說 牡丹庭 正式更名為\r\n「牡丹樓 中菜」\r\n餐廳𧫴訂於3月24 日週日上午11:00 時將舉辦Grand Re-Open 特邀您來一同參與💗\r\n冀望未來有各位先進的支持與鼓勵指教牡丹樓 能更上層樓\r\n當日現場備有各式免費點心、飲品、酒水 招待\r\n唯望舊雨新知 一起蒞臨參與賜教💗\r\n只希望你們一起來為我們共襄熱熱鬧鬧\r\n💗牡丹樓 中菜餐廳\r\n現址：台南市中西區永福路二段160號\r\n邱靖喬 0925873025 敬邀💗 \r\n電話☎️：06-2217509\r\n牡丹樓 中菜\r\n牡丹庭漢風餐食盒', 3);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`a_id`),
  ADD KEY `key_word_id` (`key_word_id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `articles`
--
ALTER TABLE `articles`
  MODIFY `a_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`key_word_id`) REFERENCES `key_words` (`k_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
