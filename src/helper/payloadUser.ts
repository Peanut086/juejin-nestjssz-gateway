import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/*
 * 自定义用户装饰器
 * */
export const PayloadUser = createParamDecorator(
  (data, ctx: ExecutionContext): Payload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
