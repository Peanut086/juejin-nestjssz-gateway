import { Inject, Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '@/user/user.mysql.entity';
import { BusinessException } from '@/common/exceptions/business.exception';
import { FeishuUserInfo } from '@/user/feishu/dto/feishu.userInfo.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  createOrSave(user) {
    try {
      return this.userRepository.save(user);
    } catch (err) {
      throw new BusinessException(err.message);
    }
  }

  /*
   * 同步飞书用户信息
   * */
  async createOrSaveByFeishu(feishuUser: FeishuUserInfo): Promise<any> {
    try {
      const feishuUserId = feishuUser.feishuUserId;
      const user = await this.userRepository.findOne({
        where: { feishuUserId },
      });
      if (user) {
        // 删除accessToken
        delete feishuUser.accessToken;
        // 更新
        const updateRes = await this.userRepository.update(user.id, feishuUser);
        if (updateRes.affected) {
          return await this.userRepository.findOne({
            where: { id: user.id },
          });
        } else {
          throw new BusinessException('用户：' + user.name + '信息更新失败！');
        }
      }
      return this.userRepository.save(feishuUser);
    } catch (err) {
      throw new BusinessException(err.message);
    }
  }
}
