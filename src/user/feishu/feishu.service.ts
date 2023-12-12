import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  getAppToken,
  getUserAccessToken,
  getUserToken,
  refreshUserToken,
} from '@/helper/feishu/auth';
import { Cache } from 'cache-manager';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ConfigService } from '@nestjs/config';
import { messages } from '@/helper/feishu/message';

@Injectable()
export class FeishuService {
  private _APP_TOKEN_CACHE_KEY;

  constructor(
    // 方便交互  将该实例注入到缓存管理器
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this._APP_TOKEN_CACHE_KEY = this.configService.get('APP_TOKEN_CACHE_KEY');
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

  async sendMessage(receive_id_type, params) {
    try {
      const app_token = await this.getAppToken();
      return messages(receive_id_type, params, app_token as string);
    } catch (error) {
      throw new BusinessException(error.message);
    }
  }
}
