import { Body, Controller, Post } from '@nestjs/common';
import { FeishuService } from './feishu.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FeishuMessageDto } from '@/user/feishu/dto/FeishuMessageDto';

@ApiTags('飞书')
@Controller('feishu')
export class FeishuController {
  constructor(private readonly feishuService: FeishuService) {}

  @Post('sendMessage')
  sendMessage(@Body() params: FeishuMessageDto) {
    const { receive_id_type, ...rest } = params;
    return this.feishuService.sendMessage(receive_id_type, rest);
  }
}
