import { DatabaseType, DataSource, DataSourceOptions } from 'typeorm';
import { getConfig } from '@/utils';
import * as path from 'path';

// 设置数据库类型为mongodb
const dataBaseType: DatabaseType = 'mysql';
// 获取mongodb配置
const { MYSQL_CONFIG } = getConfig();
const MYSQL_DATABASE_CONFIG = {
  ...MYSQL_CONFIG,
  type: dataBaseType,
  entities: [
    path.join(
      __dirname,
      `dist/../**/*.${MYSQL_CONFIG.entities}.entity{.ts,.js}`,
    ),
  ],
};
const MYSQL_DATA_SOURCE = new DataSource(MYSQL_DATABASE_CONFIG);
// 数据库实例注入
export const DatabaseProviders = [
  {
    provide: 'MYSQL_DATA_SOURCE',
    useFactory: async () => {
      try {
        if (!MYSQL_DATA_SOURCE.isInitialized)
          await MYSQL_DATA_SOURCE.initialize();
        return MYSQL_DATA_SOURCE;
      } catch (err) {
        console.log('Peanut console...😏😣😆😁🤣😂\n', '数据库连接错误！\n');
        console.log('Peanut console...😏😣😆😁🤣😂\n', err + '\n');
      }
    },
  },
];
