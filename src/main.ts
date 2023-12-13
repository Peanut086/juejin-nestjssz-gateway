import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import {
  ValidationPipe,
  VersioningType,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/exceptions/base.exception.filter';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import { generateDocument } from './doc';

declare const module: any;

async function bootstrap() {
  // 使用Fastify替换框架默认底层的Express
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // 接口启用版本化管理
  app.enableVersioning({
    type: VersioningType.URI,
    // defaultVersion: '1', // 全局配置版本控制
    defaultVersion: [VERSION_NEUTRAL], // 个性化版本控制，可用于控制部分接口
  });

  // 添加全局拦截器，用于格式化返回值
  app.useGlobalInterceptors(new TransformInterceptor());
  // 异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // 启用全局字段校验
  app.useGlobalPipes(new ValidationPipe());

  // 生成swagger文档
  generateDocument(app);

  // 热重载
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  await app.listen(3000);
}

bootstrap();
