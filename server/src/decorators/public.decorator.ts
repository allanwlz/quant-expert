/*
 * @Author: jinchao.wu@bytedance.com
 * @Date: 2023-09-02 01:20:20
 * @LastEditTime: 2023-09-02 01:20:32
 * @LastEditors: jinchao.wu@bytedance.com
 * @Description:
 * @FilePath: /erp-mono/apps/erp-server/src/decorators/public.decorator.ts
 */
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
