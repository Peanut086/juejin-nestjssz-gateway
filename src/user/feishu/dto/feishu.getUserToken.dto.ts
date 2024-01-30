import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetUserTokenDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'xxxx', description: '飞书临时登录凭证' })
  code: string;
  app_token: string;
}
