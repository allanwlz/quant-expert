/*
 * @Author: jinchao.wu@bytedance.com
 * @Date: 2023-08-11 23:17:53
 * @LastEditTime: 2023-09-02 01:39:04
 * @LastEditors: jinchao.wu@bytedance.com
 * @Description:
 * @FilePath: /erp-mono/apps/erp-server/src/modules/store/store.module.ts
 */
import { Module } from '@nestjs/common';
import { StoreService } from './store.service';

@Module({
  imports: [],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
