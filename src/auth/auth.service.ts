import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/user/user.service';
import { FeishuService } from '@/user/feishu/feishu.service';
import { User } from '@/user/user.mysql.entity';

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
    // 同步到数据库
    const user: User = await this.userService.createOrSaveByFeishu(feishuInfo);
    return {
      userId: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      feishuAccessToken: feishuInfo.accessToken,
      feishuUserId: feishuInfo.feishuUserId,
    };
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
    const { data } = await this.feishuService.getUserToken(code);
    const feishuInfo = {
      accessToken: data.access_token,
      avatarBig: data.avatar_big,
      avatarMiddle: data.avatar_middle,
      avatarThumb: data.avatar_thumb,
      avatarUrl: data.avatar_url,
      email: data.email,
      enName: data.en_name,
      mobile: data.mobile,
      name: data.name,
      feishuUnionId: data.union_id,
      feishuUserId: data.user_id,
    };
    return feishuInfo;
  }
}
