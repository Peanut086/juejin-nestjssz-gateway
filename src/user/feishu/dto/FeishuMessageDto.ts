import { RECEIVE_TYPE, MSG_TYPE } from '@/helper/feishu/message';
import { ApiProperty } from '@nestjs/swagger';

export class FeishuMessageDto {
  @ApiProperty({ example: 'email' })
  receive_id_type: RECEIVE_TYPE;

  @ApiProperty({ example: '361618664@qq.com' })
  receive_id?: string;

  @ApiProperty({ example: '{"text":"卢本伟牛逼！"}' })
  content?: string;

  @ApiProperty({ example: 'text', enum: MSG_TYPE })
  msg_type?: keyof MSG_TYPE;
}
