/*
 * @Author: jinchao.wu@bytedance.com
 * @Date: 2023-08-26 01:43:11
 * @LastEditTime: 2023-08-27 00:29:30
 * @LastEditors: jinchao.wu@bytedance.com
 * @Description:
 * @FilePath: /erp-mono/apps/erp-server/src/modules/role/models/role.model.ts
 */
import {
  Column,
  DataType,
  HasMany,
  Model,
  // PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../../user/models/user.model';

@Table({ modelName: 'sys_role', underscored: true, freezeTableName: true })
export class RoleModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.STRING(16))
  name: string;

  @Column(DataType.STRING(64))
  description: string;

  @HasMany(() => UserModel)
  users: UserModel[];
}
