import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/user/user.service';
import { FeishuService } from '@/user/feishu/feishu.service';
import { User } from '@/user/user.mysql.entity';
import { BusinessException } from '@/common/exceptions/business.exception';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private feishuService: FeishuService,
  ) {}

  /*
   * 验证飞书用户
   * */
  async validateFeishuUser(code: string) {
    const feishuInfo = await this.getFeishuUserInfoByCode(code);
    if (feishuInfo) {
      // 同步到数据库
      const user: User = await this.userService.createOrSaveByFeishu(
        feishuInfo,
      );
      return {
        userId: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        feishuAccessToken: feishuInfo.accessToken,
        feishuUserId: feishuInfo.feishuUserId,
      };
    } else {
      return null;
    }
  }

  /*
   * 登录
   * */
  async login(user: Payload) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }

  /*
   * 获取飞书用户信息
   * */
  async getFeishuUserInfoByCode(code: string) {
    try {
      const res = await this.feishuService.getUserToken(code);

      if (res) {
        return {
          accessToken: res.access_token,
          avatarBig: res.avatar_big,
          avatarMiddle: res.avatar_middle,
          avatarThumb: res.avatar_thumb,
          avatarUrl: res.avatar_url,
          email: res.email,
          enName: res.en_name,
          mobile: res.mobile,
          name: res.name,
          feishuUnionId: res.union_id,
          feishuUserId: res.user_id,
        };
      }
    } catch (e) {
      throw new BusinessException(e.message);
    }
  }
}
