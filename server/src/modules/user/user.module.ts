/*
 * @Author: jinchao.wu@bytedance.com
 * @Date: 2023-08-11 23:17:53
 * @LastEditTime: 2023-08-27 01:09:45
 * @LastEditors: jinchao.wu@bytedance.com
 * @Description:
 * @FilePath: /erp-mono/apps/erp-server/src/modules/user/user.module.ts
 */
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
