import {
    Column,
    DataType,
    Model,
    Table,
  } from 'sequelize-typescript';
  
  // `id` INT NOT NULL AUTO_INCREMENT COMMENT 'user id',
  // `username` varchar(32) NOT NULL UNIQUE COMMENT 'username',
  // `name` VARCHAR(32) NOT NULL COMMENT 'user real name',
  
  // `pwd_hash` varchar(255) NOT NULL COMMENT 'password hash',
  // `mobile` varchar(32) NOT NULL UNIQUE COMMENT 'unique mobile',
  // `email` varchar(128) DEFAULT NULL,
  // `role_id` INT NOT NULL COMMENT 'user role id',
  // `avatar` varchar(1023) COMMENT 'avatar url',
  // `disabled` BOOL DEFAULT false COMMENT 'user disabled',
  
  @Table({
    modelName: 'sum_profit',
    underscored: true,
    freezeTableName: true,
    timestamps: false // 添加这行来禁止自动时间戳
  })
  export class SumProfitModel extends Model {
    @Column({
      type: DataType.STRING,
      primaryKey: true,
    })
    date: Date;
  
    @Column({
      type: DataType.DECIMAL(10, 2),
    })
    initProfit: number;
  
    @Column({
        type: DataType.DECIMAL(10, 2),
      })
    finalProfit: number;
  }
  