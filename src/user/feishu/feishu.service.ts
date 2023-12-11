import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import {
  getAppToken,
  getUserAccessToken,
  getUserToken,
  refreshUserToken,
} from '@/helper/feishu/auth';
import { Cache } from 'cache-manager';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FeishuService {
  private APP_TOKEN_CACHE_KEY;

  constructor(
    // 方便交互  将该实例注入到缓存管理器
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.APP_TOKEN_CACHE_KEY = this.configService.get('APP_TOKEN_CACHE_KEY');
  }

  /*
   * 获取飞书token
   * */
  async getAppToken(): Promise<string> {
    let appToken = await this.configService.get(this.APP_TOKEN_CACHE_KEY);
    if (!appToken) {
      const result = await getAppToken();
      if (result.code === 0) {
        appToken = result.app_access_token;
        // 写入缓存
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await this.cacheManager.set(this.APP_TOKEN_CACHE_KEY, appToken, {
          ttl: result.expire - 60, // 有效时长
        });
      } else {
        throw new BusinessException('飞书token获取失败！');
      }
    }
    return appToken;
  }
}
