/*
 * @Author: jinchao.wu@bytedance.com
 * @Date: 2023-08-11 23:31:04
 * @LastEditTime: 2023-08-27 00:56:26
 * @LastEditors: jinchao.wu@bytedance.com
 * @Description:
 * @FilePath: /erp-mono/apps/erp-server/src/modules/user/user.service.ts
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './models/user.model';
import { WhereOptions } from 'sequelize';

@Injectable()
export class UserService {
  @InjectModel(UserModel)
  private readonly userModel: typeof UserModel;

  getUserName(): string {
    return 'Allan Wang';
  }

  async getUsers() {
    const users = await this.userModel.findAll({ include: ['role'] });
    return users;
  }

  /** 查询用户 */
  async findUser({
    username,
    mobile,
  }: {
    username?: string;
    mobile?: string;
  }): Promise<UserModel | null> {
    if (!username && !mobile) {
      return null;
    }

    const where: WhereOptions<UserModel> = {};
    if (username) {
      where['username'] = username;
    }

    if (mobile) {
      where['mobile'] = mobile;
    }

    const user = await this.userModel.findOne({ where });
    return user;
  }

  /** 通过 id 查询用户 */
}
