import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/auth.dtos';
import { buildErrorResponse, buildSuccessResponse } from 'src/utils/response';
import { Public } from 'src/decorators/public.decorator';

@Controller('/')
export class AuthController {
  @Inject()
  private readonly authService: AuthService;

  @Public()
  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    const { username, password } = signInDto;
    const { errorMsg, data } = await this.authService.signIn({
      username,
      password,
    });

    if (errorMsg) {
      return buildErrorResponse(errorMsg);
    }

    return buildSuccessResponse(data);
  }

  @Get('/validate-token')
  async validateToken() {
    return buildSuccessResponse('Token有效');
  }
}
