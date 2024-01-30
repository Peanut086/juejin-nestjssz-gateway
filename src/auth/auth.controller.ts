import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { FeiShuAuthGuard } from './guards/feishu-auth.guard';
import { Public } from '@/auth/constants';
import { PayloadUser } from '@/helper/payloadUser';
import { FastifyReply } from 'fastify';
import { GetTokenByApplications } from '@/auth/dto/auth.dto';

@ApiTags('用户认证')
@Controller({
  path: 'auth',
  version: [VERSION_NEUTRAL],
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: '飞书 Auth2 授权登录',
    description:
      '通过 code 获取`access_token`https://open.feishu.cn/open-apis/authen/v1/index?app_id=cli_xxxxxx&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Fauth',
  })
  @UseGuards(FeiShuAuthGuard)
  @Public()
  @Get('/feishu/auth2')
  async getFeishuTokenByApplications(
    @PayloadUser() user: Payload,
    @Res({ passthrough: true }) response: FastifyReply,
    @Query() query: GetTokenByApplications,
  ) {
    const access_token = await this.authService.login(user);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    response.setCookie('jwt', access_token, {
      path: '/',
    });
    return access_token;
  }

  @ApiOperation({
    summary: '解析token',
  })
  @Get('/token/info')
  async getTokenInfo(@PayloadUser() user: Payload) {
    return user;
  }
}
