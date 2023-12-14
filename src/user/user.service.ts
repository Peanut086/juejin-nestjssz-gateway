import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '@/user/user.mysql.entity';
import { BusinessException } from '@/common/exceptions/business.exception';

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
}
