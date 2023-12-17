import { parse } from 'yaml';
import * as process from 'process';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

// 获取项目运行环境
export const getEnv = () => {
  return process.env.RUNNING_ENV;
};

// 获取对应环境下的配置
export const getConfig = (type?: string) => {
  try {
    const envTag = getEnv();
    const yamlPath = path.join(process.cwd(), `./.config/.${envTag}.yaml`);
    const file = fs.readFileSync(yamlPath, 'utf-8');
    const config = parse(file);
    console.log('当前运行环境：', envTag + '\n');
    if (type) {
      return config[type];
    }
    return config;
  } catch (e) {
    console.log('获取系统配置失败，请检查对应环境下的yml文件是否正确配置！\n');
  }
};
