import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { getConfig } from './utils';
import { FeishuModule } from '@/user/feishu/feishu.module';
import { redisStore } from 'cache-manager-redis-store';
import { AuthModule } from '@/auth/auth.module';

@Module({
  // 引入配置模块ConfigModule，同时不启用框架默认的env配置文件
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true, // 全局开启，这样就不需要在每个模块下的Module文件下单独启用
      load: [getConfig],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: getConfig('REDIS_CONFIG').host,
            port: getConfig('REDIS_CONFIG').port,
          },
          database: getConfig('REDIS_CONFIG').db,
          password: getConfig('REDIS_CONFIG').password,
        } as any);
        return {
          store: store as any,
        };
      },
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
