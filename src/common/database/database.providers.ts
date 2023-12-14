import { DataSource, DataSourceOptions } from 'typeorm';
import { getConfig } from '@/utils';
import { User } from '@/user/user.mysql.entity';

const { MYSQL_CONFIG } = getConfig();
const dataBaseType: DataSourceOptions['type'] = MYSQL_CONFIG.type;

// 获取mongodb配置
const MYSQL_DATABASE_CONFIG = {
  ...MYSQL_CONFIG,
  type: dataBaseType,
  entities: [User],
};

const MYSQL_DATA_SOURCE = new DataSource({
  ...MYSQL_DATABASE_CONFIG,
});

// 数据库实例注入
export const DatabaseProviders = [
  {
    provide: 'MYSQL_DATA_SOURCE',
    useFactory: async () => {
      try {
        if (!MYSQL_DATA_SOURCE.isInitialized)
          await MYSQL_DATA_SOURCE.initialize();
        console.log('数据库初始化成功！');
        return MYSQL_DATA_SOURCE;
      } catch (err) {
        console.log('数据库初始化失败！' + err.message);
      }
    },
  },
];
