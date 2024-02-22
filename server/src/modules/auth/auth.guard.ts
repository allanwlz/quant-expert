/*
 * @Author: jinchao.wu@bytedance.com
 * @Date: 2023-09-02 01:15:15
 * @LastEditTime: 2023-09-03 00:53:46
 * @LastEditors: jinchao.wu@bytedance.com
 * @Description:
 * @FilePath: /erp-mono/apps/erp-server/src/modules/auth/auth.guard.ts
 */
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { jwtTokenSalt } from 'src/constants';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { UserService } from '../user/user.service';
import { StoreService } from '../store/store.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

interface JwtPayload {
  username?: string;
  exp?: number;
}

@Injectable()
export default class AuthGuard implements CanActivate {
  @Inject()
  private readonly reflector: Reflector;

  @Inject()
  private readonly jwtService: JwtService;

  @Inject()
  private readonly userService: UserService;

  @Inject()
  private readonly storeService: StoreService;

  @Inject(CACHE_MANAGER)
  private readonly cacheService: Cache;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 判断 class 或者 handler 上面是否有 @Public 的标志，如果有，那么不需要鉴权
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const jwtToken = request?.headers?.['x-jwt-token'];

    if (!jwtToken) {
      console.log('no jwt token');
      return false;
    }

    try {
      let payload = (await this.cacheService.get(jwtToken)) as JwtPayload;
      console.log('cache payload: ', payload);
      if (!payload || !payload?.username || !payload?.exp) {
        payload = (await this.jwtService.verify(jwtToken, {
          secret: jwtTokenSalt,
        })) as JwtPayload;
      }

      const { username, exp } = payload || {};
      const currentTs = Math.floor(Date.now() / 1000);
      if (!username || !exp || exp < currentTs) {
        return false;
      }

      const user = await this.userService.findUser({
        username: username,
      });

      if (user) {
        this.storeService.setUser(user);
      }

      await this.cacheService.set(
        jwtToken,
        { username, exp },
        (exp - currentTs) * 1000,
      );

      return Boolean(user);
    } catch {
      return false;
    }
  }
}
