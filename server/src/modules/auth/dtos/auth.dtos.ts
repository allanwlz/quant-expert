/*
 * @Author: jinchao.wu@bytedance.com
 * @Date: 2023-08-27 01:03:10
 * @LastEditTime: 2023-08-27 01:14:20
 * @LastEditors: jinchao.wu@bytedance.com
 * @Description:
 * @FilePath: /erp-mono/apps/erp-server/src/modules/auth/dtos/auth.dtos.ts
 */
import { IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
