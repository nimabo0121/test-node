create database test;
use test;
#drop database mudanlow;
#drop database test;
create table member_profile( #主表, 會員基本資料/註冊, 欄位皆不可為空
id int auto_increment primary key, #會員id
member_name varchar(50) not null, #會員姓名
gender varchar(5) not null, #性別
email varchar(254) not null unique, #會員信箱,唯一
mobile varchar(15) not null unique, #會員手機,唯一
birthday date not null, #生日
create_date datetime not null, #帳號建立日期, 不可為空
password varchar(255) not null, #密碼, 不可為空
hash VARCHAR(255) NOT NULL,
role enum('user', 'admin')not null default 'user', #普通使用者與管理者, 用來登入區別後台or一般頁面
status enum('active', 'blacklist')not null default 'active', # 黑名單用
reason varchar(255), # 黑名單原因
blacklist_date datetime comment '黑名單日期'
);
show warnings;
INSERT INTO member_profile (member_name, gender, email, mobile, birthday, create_date, password, hash, role, status, reason, blacklist_date)
VALUES ('张三', '男', 'zhangsan@example.com', '13812345678', '1990-01-01', '2023-06-16 14:30:00', 'hashed_password', 'hashed_hash', 'user', 'active', NULL, NULL);

CREATE TABLE cart_status (
    sid int auto_increment primary key, # 狀態ID
    status_name varchar(50) not null, # 狀態名稱
    status_remark varchar(255) # 備註
);

INSERT INTO cart_status (status_name, status_remark) VALUES
('已送出訂單', '待店家確認'),
('店家以確認', '訂單處於待處理狀態'),
('商品已送達', '待買家取貨'),
('取消訂單', '已取消'),
('完成訂單,買家以確認完成');

create table contact_book(	# 聯絡資料
member_profile_id int ,
cb_id int auto_increment primary key,
receive_name varchar(50) default null, #收件者姓名, 可為空
address varchar(255) default null, #收件者地址, 可為空
contact_mobile varchar(15) default null, #收件者手機, 可為空
foreign key (member_profile_id) references member_profile(id)
);

create table member_card( #購物車
 member_profile_id int , #會員id
 book_id int, # 收件人
 status_id int default 1, # 購物車狀態ID
 c_id int, #購物車ID,訂單編號
 productName varchar(255), #商品名稱
 price decimal(10,2), #商品價格
 quantity int(11), #數量
 totalPrice decimal(10,2), #總價
 card_date datetime not null, #帳單建立時間
 foreign key (member_profile_id) references member_profile(id),
 foreign key (status_id) references cart_status(sid),
 foreign key (book_id) references contact_book(cb_id)
 );

-- 創建預約系統資料表 reservation
CREATE TABLE reservation (
	member_profile_id int ,
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_type VARCHAR(50) NOT NULL,
    people VARCHAR(50) NOT NULL,
    date VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL,
    dining_method VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key (member_profile_id) references member_profile(id)
);

-- 以下為菜單

CREATE TABLE menu_items ( #菜單分類
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    item_name varchar(50)
);

insert into menu_items(item_name)
values
('combo_meal'), -- 合菜
('product'), -- 單點
('drink'), -- 飲品
('liquor'), -- 酒水
('dessert'), -- 甜點
('bento'), -- 便當
('vacuum') ; -- 真空包

#合菜

create table combo_meal(
item_id int, #分類編號
id int primary key auto_increment , -- 合菜編號
name varchar(80), -- 合菜名稱
price int ,
image varchar(1000) default '[]',
foreign key (item_id)
references menu_items (item_id)
 );

#甜點

create table dessert(
item_id int, #分類編號
id int primary key auto_increment,  -- 甜點編號
name varchar(80), -- 甜點名稱
price int, -- 甜點價錢
image varchar(1000) default '[]',
foreign key (item_id) 
references menu_items(item_id)
);

#飲料

create table drink (
item_id int, #分類編號
id int primary key auto_increment,  #飲料編號
name varchar(80),  #飲料名稱
price int,  #飲料價錢
image varchar(1000) default '[]',
foreign key (item_id) references menu_items(item_id)
);

#酒水

create table liquor(
item_id int, #分類編號
id int primary key auto_increment , #酒編號
name varchar(80), #酒名
price int, #酒價錢
image varchar(1000) default '[]',
foreign key (item_id) references menu_items(item_id)
);

#單點

create table product(
item_id int, #分類編號
id int primary key auto_increment, -- 單點編號
name varchar(80) not null,  -- 單點名稱
price int,  -- 單點價錢
image varchar(1000) default '[]',
foreign key (item_id) references menu_items(item_id)
);

#便當

create table bento(
item_id int, #分類編號
id int primary key auto_increment , #便當編號
name varchar(80), #便當價錢
price int, #便當價錢
image varchar(1000) default '[]',
foreign key (item_id) references menu_items(item_id)
);

#真空包

create table vacuum(
item_id int, #分類編號
id int primary key auto_increment, #真空包id
name varchar(80) , #真空包名稱
price int, #真空包價格
image varchar(1000) default '[]',
foreign key (item_id) references menu_items (item_id)
);

-- 以下為訂單

create table orderlist(
o_id int primary key, #訂單編號
member_id int, #會員id
product_id int, #產品id
product_time datetime, #訂單時間
product_quantity int, #訂單數量
foreign key (member_id) references member_profile(id),
foreign key (product_id) references vacuum(id)
);

-- 以下是文章

create table key_words (
k_id int primary key, #關鍵字id
key_name varchar(10) #關鍵字
);

CREATE TABLE articles (
    a_id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    title VARCHAR(255),
    photos VARCHAR(255),
    content TEXT,
    key_word_id int, #文章關鍵字
    foreign key (key_word_id) references key_words (k_id)
);

insert into key_words
value
(1,"所有文章"),
(2,"新菜消息"),
(3,"節慶活動"),
(4,"公休時間"),
(5,"貓咪認養");

-- 創建預約系統資料表 reservation
CREATE TABLE IF NOT EXISTS reservation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    count INT NOT NULL,
    guests VARCHAR(255) NOT NULL,
    reservationDateTime DATE NOT NULL,
    timeSelect TIME NOT NULL,
    menuSelect VARCHAR(255) NOT NULL
);

