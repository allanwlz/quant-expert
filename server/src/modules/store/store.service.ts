/*
 * @Author: jinchao.wu@bytedance.com
 * @Date: 2023-08-11 23:31:04
 * @LastEditTime: 2023-09-03 00:36:39
 * @LastEditors: jinchao.wu@bytedance.com
 * @Description:
 * @FilePath: /erp-mono/apps/erp-server/src/modules/store/store.service.ts
 */
import { Injectable } from '@nestjs/common';
import type { UserModel } from '../user/models/user.model';

@Injectable()
export class StoreService {
  private _user: UserModel | null = null;

  get currentUser() {
    const user = { ...this._user.dataValues };
    delete user.pwdHash;
    return user;
  }

  setUser(user: UserModel) {
    this._user = user;
  }
}
