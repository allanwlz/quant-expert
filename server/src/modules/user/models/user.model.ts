/*
 * @Author: jinchao.wu@bytedance.com
 * @Date: 2023-08-26 01:43:11
 * @LastEditTime: 2023-08-27 00:36:27
 * @LastEditors: jinchao.wu@bytedance.com
 * @Description:
 * @FilePath: /erp-mono/apps/erp-server/src/modules/user/models/user.model.ts
 */
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  // PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { RoleModel } from 'src/modules/role/models/role.model';

// `id` INT NOT NULL AUTO_INCREMENT COMMENT 'user id',
// `username` varchar(32) NOT NULL UNIQUE COMMENT 'username',
// `name` VARCHAR(32) NOT NULL COMMENT 'user real name',

// `pwd_hash` varchar(255) NOT NULL COMMENT 'password hash',
// `mobile` varchar(32) NOT NULL UNIQUE COMMENT 'unique mobile',
// `email` varchar(128) DEFAULT NULL,
// `role_id` INT NOT NULL COMMENT 'user role id',
// `avatar` varchar(1023) COMMENT 'avatar url',
// `disabled` BOOL DEFAULT false COMMENT 'user disabled',

@Table({ modelName: 'sys_user', underscored: true, freezeTableName: true })
export class UserModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(32),
    unique: true,
  })
  username: string;

  @Column(DataType.STRING(32))
  name: string;

  @Column(DataType.STRING(255))
  pwdHash: string;

  @Column({
    type: DataType.STRING(32),
    unique: true,
  })
  mobile: string; // 手机号 unique

  @Column(DataType.STRING(128))
  email: string; // 邮箱

  @Column(DataType.INTEGER)
  @ForeignKey(() => RoleModel)
  roleId: string; // role_id，外键

  @BelongsTo(() => RoleModel)
  role: RoleModel;

  @Column(DataType.STRING(1023))
  avatar: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  disabled: boolean;
}
