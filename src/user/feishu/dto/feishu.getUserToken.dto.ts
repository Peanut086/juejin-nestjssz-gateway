import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserTokenDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'xxxxxxxxx',
    description: '飞书临时登录凭证',
  })
  code: string;

  app_token: string;
}
