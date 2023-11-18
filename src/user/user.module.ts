import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FeishuModule } from './feishu/feishu.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [FeishuModule],
})
export class UserModule {}
