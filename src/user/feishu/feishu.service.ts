import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  getAppToken,
  GetAppTokenRes,
  getUserAccessToken,
  getUserToken,
  refreshUserToken,
} from '@/helper/feishu/auth';
import { Cache } from 'cache-manager';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ConfigService } from '@nestjs/config';
import { messages } from '@/helper/feishu/message';
import { GetUserTokenDto } from '@/user/feishu/dto/feishu.getUserToken.dto';
import { BUSINESS_ERROR_CODE } from '@/common/exceptions/business.error.codes';

@Injectable()
export class FeishuService {
  private _APP_TOKEN_CACHE_KEY;
  private _USER_TOEKN_CACHE_KEY;
  private _USER_REFRESH_TOKEN_CACHE_KEY;

  constructor(
    // 方便交互  将该实例注入到缓存管理器
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this._APP_TOKEN_CACHE_KEY = this.configService.get('APP_TOKEN_CACHE_KEY');
    this._USER_TOEKN_CACHE_KEY = this.configService.get('USER_TOKEN_CACHE_KEY');
    this._USER_REFRESH_TOKEN_CACHE_KEY = this.configService.get(
      'USER_REFRESH_TOKEN_CACHE_KEY',
    );
  }

  /*
   * 获取飞书token
   * */
  async getAppToken(): Promise<string> {
    let appToken = await this.cacheManager.get<string>(
      this._APP_TOKEN_CACHE_KEY,
    );
    if (!appToken) {
      const result = await getAppToken();
      if (result.code === 0) {
        appToken = result.app_access_token;
        // 写入缓存
        await this.cacheManager.set(
          this._APP_TOKEN_CACHE_KEY,
          appToken,
          result.expire - 60,
        );
      } else {
        throw new BusinessException('飞书token获取失败！');
      }
    }
    return appToken;
  }

  /*
   * 获取飞书用户凭证
   * */
  async getUserToken(code: string) {
    const app_token: GetAppTokenRes = await getAppToken();
    const dto: GetUserTokenDto = {
      code,
      app_token: app_token.app_access_token,
    };
    const res = await getUserToken(dto);
    if (res.code !== 0) {
      throw new BusinessException(res.message);
    }
    return res.data;
  }

  /*
   * 缓存飞书用户token
   * */
  async setUserCacheToken(tokenInfo: any) {
    const {
      refresh_token,
      access_token,
      user_id,
      expires_in,
      refresh_expires_in,
    } = tokenInfo;

    // 缓存用户token
    await this.cacheManager.set(
      `${this._USER_TOEKN_CACHE_KEY}_${user_id}`,
      access_token,
      expires_in - 60,
    );

    await this.cacheManager.set(
      `${this._USER_REFRESH_TOKEN_CACHE_KEY}_${user_id}`,
      refresh_token,
      refresh_expires_in - 60,
    );
  }

  /*
   * 从缓存获取用户token，如果token失效则通过refresh_token刷新token
   * */
  async getCachedUserToken(userId: string) {
    let userToken = await this.cacheManager.get(
      `${this._USER_TOEKN_CACHE_KEY}_${userId}`,
    );
    if (!userToken) {
      // 从缓存获取refresh_token
      const refreshToken: string = await this.cacheManager.get(
        `${this._USER_REFRESH_TOKEN_CACHE_KEY}_${userId}`,
      );
      if (!refreshToken) {
        throw new BusinessException({
          code: BUSINESS_ERROR_CODE.TOKEN_INVALID,
          message: '飞书token 已失效！',
        });
      }
      // 获取新的token
      const newUserTokenInfo = await this.getUserTokenByRefreshToken(
        refreshToken,
      );
      await this.setUserCacheToken(newUserTokenInfo);
      userToken = newUserTokenInfo.access_token;
    }
    return userToken;
  }

  /*
   * 根据refreshToken获取token
   * */
  async getUserTokenByRefreshToken(refreshToken: string) {
    return refreshUserToken({
      refreshToken,
      app_token: await this.getAppToken(),
    });
  }

  async sendMessage(receive_id_type, params) {
    try {
      const app_token = await this.getAppToken();
      return messages(receive_id_type, params, app_token as string);
    } catch (error) {
      throw new BusinessException(error.message);
    }
  }
}
