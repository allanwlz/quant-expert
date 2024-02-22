/*
 * @Author: jinchao.wu@bytedance.com
 * @Date: 2023-08-11 23:17:53
 * @LastEditTime: 2023-09-02 01:33:26
 * @LastEditors: jinchao.wu@bytedance.com
 * @Description:
 * @FilePath: /erp-mono/apps/erp-server/src/modules/auth/auth.module.ts
 */
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtTokenSalt } from 'src/constants';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: jwtTokenSalt,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
