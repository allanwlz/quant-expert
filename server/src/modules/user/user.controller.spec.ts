/*
 * @Author: jinchao.wu@bytedance.com
 * @Date: 2023-08-26 00:55:20
 * @LastEditTime: 2023-08-26 00:57:14
 * @LastEditors: jinchao.wu@bytedance.com
 * @Description:
 * @FilePath: /erp-mono/apps/erp-server/src/modules/user/user.controller.spec.ts
 */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  describe('root', () => {
    it('should return "Jinchao Wu"', () => {
      expect(userController.getHello().data.user_name).toBe('Jinchao Wu');
    });
  });
});
