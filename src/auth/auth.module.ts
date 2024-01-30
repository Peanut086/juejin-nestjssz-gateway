import { Module } from '@nestjs/common';
import { UserModule } from '@/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { JwtAuthStrategy } from '@/auth/strategies/jwt-auth.strategy';
import { FeishuStrategy } from '@/auth/strategies/feishu-auth.strategy';
import { FeishuService } from '@/user/feishu/feishu.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: jwtConstants.expiresIn,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, FeishuService, JwtAuthStrategy, FeishuStrategy],
  exports: [AuthService],
})
export class AuthModule {}
