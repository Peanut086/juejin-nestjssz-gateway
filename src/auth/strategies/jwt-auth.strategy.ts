import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { Strategy } from 'passport';
import { jwtConstants } from '@/auth/constants';

type FgRequest = FastifyRequest & { cookies: { jwt: string } };

const cookieExtractor = (req: FgRequest) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: jwtConstants.ignoreExpiration,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: Payload): Promise<Payload> {
    return { ...payload };
  }
}
