import { Inject, Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { User } from '@/user/entities/user.mongo.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: MongoRepository<User>,
  ) {}

  createOrSave(user) {
    try {
      return this.userRepository.save(user);
    } catch (e) {
      console.log('Peanut console...😏😣😆😁🤣😂\n', e);
    }
  }
}
