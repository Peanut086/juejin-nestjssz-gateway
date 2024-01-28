import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { getConfig } from './utils';
import { FeishuModule } from '@/user/feishu/feishu.module';
import { RedisStore, redisStore } from 'cache-manager-redis-store';

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      useFactory: () => {
        const store = redisStore({
          socket: {
            host: getConfig('REDIS_CONFIG').host,
            port: +getConfig('REDIS_CONFIG').port,
          },
          password: getConfig('REDIS_CONFIG').password,
        });
        return {
          store,
          ttl: 60 * 60 * 24 * 7,
        };
      },
    }),
    UserModule,
    FeishuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
