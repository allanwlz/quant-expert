import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { checkHash } from 'src/utils/hash';
import { JwtService } from '@nestjs/jwt';
import { IServiceRes } from 'src/typings';

@Injectable()
export class AuthService {
  @Inject()
  private readonly userService: UserService;

  @Inject()
  private readonly jwtService: JwtService;

  async signIn({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<IServiceRes<string>> {
    const user = await this.userService.findUser({ username });
    if (!user) {
      return { errorMsg: '用户名不存在' };
    }
    const matched = await checkHash(password, user.pwdHash);
    if (!matched) {
      return { errorMsg: '密码错误' };
    }
    const jwtToken = await this._getJwtToken(username);
    if (!jwtToken) {
      return { errorMsg: 'JWT令牌生成失败' };
    }

    return { errorMsg: '', data: jwtToken };
  }

  private async _getJwtToken(username: string) {
    try {
      const jwt = await this.jwtService.sign({ username });
      return jwt;
    } catch {
      return '';
    }
  }

  async validateToken(): Promise<IServiceRes<string>> {
    return { errorMsg: '', data: 'Token有效' };
  }
}
