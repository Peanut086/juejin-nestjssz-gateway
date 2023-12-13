import { DatabaseType, DataSource, DataSourceOptions } from 'typeorm';
import { getConfig } from '@/utils';
import * as path from 'path';

// 设置数据库类型为mongodb
const dataBaseType: DatabaseType = 'mongodb';
// 获取mongodb配置
const { MONGODB_CONFIG } = getConfig();
const MONGO_DATEBASE_CONFIG = {
  ...MONGODB_CONFIG,
  type: dataBaseType,
  entities: [
    path.join(
      __dirname,
      `dist/../**/*.${MONGODB_CONFIG.entities}.entity{.ts,.js}`,
    ),
  ],
};

const MONGO_DATE_SOURCE = new DataSource(MONGO_DATEBASE_CONFIG);

// 数据库实例注入
export const DatabaseProviders = [
  {
    provide: 'MONGODB_DATA_SOURCE',
    useFactory: async () => {
      try {
        await MONGO_DATE_SOURCE.initialize();
        return MONGO_DATE_SOURCE;
      } catch (err) {
        console.log('Peanut console...😏😣😆😁🤣😂\n', '数据库连接错误！\n');
        console.log('Peanut console...😏😣😆😁🤣😂\n', err + '\n');
      }
    },
  },
];
