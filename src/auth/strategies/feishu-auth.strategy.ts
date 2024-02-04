import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';
import { AuthService } from '@/auth/auth.service';
import { FastifyRequest } from 'fastify';

@Injectable()
export class FeiShuStrategy extends PassportStrategy(Strategy, 'feishu') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: FastifyRequest) {
    const q: any = req.query;
    return await this.authService.validateFeishuUser(q.code as string);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async authenticate(req: FastifyRequest, options?: any): any {
    // 自定义 authenticate 方法
    try {
      const user = await this.validate(req);
      if (user.userId) {
        this.success(user);
        return user;
      }
    } catch (error) {
      this.error(error);
    }
  }
}
