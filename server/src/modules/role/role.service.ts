/*
 * @Author: jinchao.wu@bytedance.com
 * @Date: 2023-08-11 23:31:04
 * @LastEditTime: 2023-09-02 01:47:22
 * @LastEditors: jinchao.wu@bytedance.com
 * @Description:
 * @FilePath: /erp-mono/apps/erp-server/src/modules/role/role.service.ts
 */
import { Injectable } from '@nestjs/common';
import { RoleModel } from './models/role.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class RoleService {
  @InjectModel(RoleModel)
  private readonly roleModel: typeof RoleModel;

  getRole(): string {
    return 'Liangzhou';
  }

  async getRoles() {
    const records = await this.roleModel.findAll({ include: ['users'] });
    return records;
  }
}
