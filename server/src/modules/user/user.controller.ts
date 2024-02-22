/*
 * @Author: jinchao.wu@bytedance.com
 * @Date: 2023-08-11 23:17:53
 * @LastEditTime: 2023-08-27 00:55:38
 * @LastEditors: jinchao.wu@bytedance.com
 * @Description:
 * @FilePath: /erp-mono/apps/erp-server/src/modules/user/user.controller.ts
 */
import { Controller, Get, Inject } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  @Inject()
  private readonly userService: UserService;

  @Get('/name')
  getHello() {
    const user_name = this.userService.getUserName();
    return {
      code: 0,
      msg: 'success',
      data: {
        user_name,
      },
    };
  }

  @Get('/list')
  async getUserList() {
    // const users = await this.userService.getUsers();
    const user = await this.userService.findUser({ username: 'admin2' });
    return {
      code: 0,
      msg: 'success',
      data: user,
    };
  }
}
