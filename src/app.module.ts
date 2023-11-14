import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { getConfig } from './utils';

@Module({
  // 引入配置模块ConfigModule，同时不启用框架默认的env配置文件
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true, // 全局开启，这样就不需要在每个模块下的Module文件下单独启用
      load: [getConfig],
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
