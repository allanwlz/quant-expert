-- DROP DATABASE IF EXISTS db_qe;
CREATE DATABASE IF NOT EXISTS db_qe;
USE db_qe;

CREATE TABLE IF NOT EXISTS `sys_role` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'role id',
  `name` VARCHAR(16) NOT NULL UNIQUE COMMENT 'role name',
  `description` VARCHAR(64) DEFAULT NULL COMMENT 'role description',

  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `index_role_name`(`name`) USING BTREE COMMENT 'search role with role name'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

INSERT IGNORE INTO `sys_role` (`id`, `name`, `description`) VALUES (1, 'Admin', 'System admin with all authorities');

CREATE TABLE IF NOT EXISTS `sys_user`  (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'user id',
  `username` varchar(32) NOT NULL UNIQUE COMMENT 'username',
  `name` VARCHAR(32) NOT NULL COMMENT 'user real name', 

  `pwd_hash` varchar(255) NOT NULL COMMENT 'password hash',
  `mobile` varchar(32) NOT NULL UNIQUE COMMENT 'unique mobile',
  `email` varchar(128) DEFAULT NULL,
  `role_id` INT NOT NULL COMMENT 'user role id',
  `avatar` varchar(1023) COMMENT 'avatar url',
  `disabled` BOOL DEFAULT false COMMENT 'user disabled',

  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `index_user_username`(`username`) USING BTREE COMMENT 'search with username',
  UNIQUE INDEX `index_user_mobile`(`mobile`) USING BTREE COMMENT 'search with mobile',
  CONSTRAINT `foreign_user_role` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- username: admin
-- password: admin@erp
INSERT IGNORE INTO `sys_user` (`id`, `username`, `name`, `pwd_hash`, `mobile`, `email`, `role_id`, `avatar`, `disabled`) VALUES (1, 'admin', 'Admin', '6065b3eb4f083776f5d0391df3a7fc172fe829c1f79f96d4d626a7d0f68bc615', '13261763927', 'allan.wanglz@qq.com', 1, '', false);

CREATE TABLE IF NOT EXISTS `sum_profit` (
  `date` DATE NOT NULL COMMENT 'date',
  `init_profit` DECIMAL(10, 2) NOT NULL COMMENT 'init profit of the day',
  `final_profit` DECIMAL(10, 2) NOT NULL COMMENT 'final profit of the day',
  PRIMARY KEY (`date`) USING BTREE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

