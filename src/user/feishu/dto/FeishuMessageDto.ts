import { RECEIVE_TYPE, MSG_TYPE } from '@/helper/feishu/message';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class FeishuMessageDto {
  @ApiProperty({ example: 'email', enum: RECEIVE_TYPE })
  @IsNotEmpty()
  @IsEnum(RECEIVE_TYPE)
  receive_id_type: RECEIVE_TYPE;

  @ApiProperty({ example: '361618664@qq.com' })
  @IsNotEmpty()
  receive_id?: string;

  @ApiProperty({ example: '{"text":"卢本伟牛逼！"}' })
  @IsNotEmpty()
  content?: string;

  @ApiProperty({ example: 'text', enum: MSG_TYPE })
  @IsEnum(MSG_TYPE)
  @IsNotEmpty()
  msg_type?: keyof MSG_TYPE;
}
