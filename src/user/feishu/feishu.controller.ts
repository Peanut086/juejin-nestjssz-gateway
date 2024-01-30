import {
  Body,
  Controller,
  Post,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FeishuService } from './feishu.service';
import { FeishuMessageDto } from './dto/feishu.message.dto';
import { GetUserTokenDto } from '@/user/feishu/dto/feishu.getUserToken.dto';

@ApiTags('飞书')
@Controller('feishu')
export class FeishuController {
  constructor(private readonly feishuService: FeishuService) {}

  /*
   * 如果出现400，可能是需要到后台调试界面手动刷新token
   * */
  @ApiOperation({
    summary: '消息推送',
  })
  @Version([VERSION_NEUTRAL])
  @Post('sendMessage')
  sendMessage(@Body() params: FeishuMessageDto) {
    const { receive_id_type, ...rest } = params;
    return this.feishuService.sendMessage(receive_id_type, rest);
  }

  @ApiOperation({
    summary: '获取用户凭证',
  })
  @Post('getUserToken')
  getUserToken(@Body() params: GetUserTokenDto) {
    const { code } = params;
    return this.feishuService.getUserToken(code);
  }
}
