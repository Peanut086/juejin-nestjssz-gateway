import { DatabaseType, DataSource, DataSourceOptions } from 'typeorm';
import { getConfig } from '@/utils';
import * as path from 'path';

// 设置数据库类型为mongodb
const dataBaseType: DatabaseType = 'mysql';
// 获取mongodb配置
const { MYSQLDB_CONFIG } = getConfig();
const MYSQL_DATEBASE_CONFIG = {
  ...MYSQLDB_CONFIG,
  type: dataBaseType,
  entities: [
    path.join(
      __dirname,
      `dist/../**/*.${MYSQLDB_CONFIG.entities}.entity{.ts,.js}`,
    ),
  ],
};
const MYSQLDB_DATA_SOURCE = new DataSource(MYSQL_DATEBASE_CONFIG);
// 数据库实例注入
export const DatabaseProviders = [
  {
    provide: 'MYSQLDB_DATA_SOURCE',
    useFactory: async () => {
      try {
        if (!MYSQLDB_DATA_SOURCE.isInitialized)
          await MYSQLDB_DATA_SOURCE.initialize();
        return MYSQLDB_DATA_SOURCE;
      } catch (err) {
        console.log('Peanut console...😏😣😆😁🤣😂\n', '数据库连接错误！\n');
        console.log('Peanut console...😏😣😆😁🤣😂\n', err + '\n');
      }
    },
  },
];
