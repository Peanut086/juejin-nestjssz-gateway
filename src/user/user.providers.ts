import { User } from '@/user/user.mysql.entity';

export const UserProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(User),
    inject: ['MYSQL_DATA_SOURCE'],
  },
];
