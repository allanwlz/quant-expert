/*
 * @Author: jinchao.wu@bytedance.com
 * @Date: 2023-08-11 23:17:53
 * @LastEditTime: 2023-09-02 01:46:54
 * @LastEditors: jinchao.wu@bytedance.com
 * @Description:
 * @FilePath: /erp-mono/apps/erp-server/src/modules/role/role.module.ts
 */
import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleModel } from './models/role.model';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [SequelizeModule.forFeature([RoleModel]), StoreModule],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
