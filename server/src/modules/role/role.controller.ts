/*
 * @Author: jinchao.wu@bytedance.com
 * @Date: 2023-08-11 23:17:53
 * @LastEditTime: 2023-09-03 00:51:53
 * @LastEditors: jinchao.wu@bytedance.com
 * @Description:
 * @FilePath: /erp-mono/apps/erp-server/src/modules/role/role.controller.ts
 */
import { Controller, Get, Inject } from '@nestjs/common';
import { RoleService } from './role.service';
import { buildSuccessResponse } from 'src/utils/response';
// import { StoreService } from '../store/store.service';

@Controller('/role')
export class RoleController {
  @Inject()
  private readonly roleService: RoleService;

  // @Inject()
  // private readonly storeService: StoreService;

  @Get('/name')
  getRole() {
    const user_name = this.roleService.getRole();
    return buildSuccessResponse(user_name);
  }

  @Get('/list')
  async getRoles() {
    const roles = await this.roleService.getRoles();
    return {
      roles,
    };
  }
}
