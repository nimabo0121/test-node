-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-05-09 15:11:36
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
-- 資料表結構 `member_card`
--

CREATE TABLE `member_card` (
  `member_profile_id` int DEFAULT NULL,
  `c_id` int DEFAULT NULL,
  `productName` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `totalPrice` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- 傾印資料表的資料 `member_card`
--

INSERT INTO `member_card` (`member_profile_id`, `c_id`, `productName`, `price`, `quantity`, `totalPrice`) VALUES
(31, 843748, '蝦菇奶油醬', 350.00, 5, 1750.00),
(31, 733845, '蝦菇奶油醬', 350.00, 3, 1050.00);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `member_card`
--
ALTER TABLE `member_card`
  ADD KEY `member_profile_id` (`member_profile_id`);

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `member_card`
--
ALTER TABLE `member_card`
  ADD CONSTRAINT `member_card_ibfk_1` FOREIGN KEY (`member_profile_id`) REFERENCES `member_profile` (`id`);
COMMIT;

INSERT INTO `member_card`(`member_profile_id`,`c_id`, `productName`, `price`, `quantity`)
VALUES(1,1111,"蝦菇奶油醬",350,2),
(2,1234,"蝦菇奶油醬",350,5);


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
