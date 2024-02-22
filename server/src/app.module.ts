/*
 * @Author: jinchao.wu@bytedance.com
 * @Date: 2023-08-26 00:48:16
 * @LastEditTime: 2023-09-03 00:41:32
 * @LastEditors: jinchao.wu@bytedance.com
 * @Description:
 * @FilePath: /erp-mono/apps/erp-server/src/app.module.ts
 */
import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './modules/auth/auth.module';
import AuthGuard from './modules/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { jwtTokenSalt } from './constants';
import { StoreModule } from './modules/store/store.module';
import { StatModule } from './modules/stat/stat.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    UserModule,
    RoleModule,
    AuthModule,
    StatModule,
    /** 用来缓存全局数据 */
    StoreModule,
    /** 缓存 */
    CacheModule.register(),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3307,
      username: 'root',
      password: 'qepwd1231',
      database: 'db_qe',

      /** models 自动发现 */
      autoLoadModels: true,
      synchronize: true,
    }),
    JwtModule.register({
      secret: jwtTokenSalt,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
