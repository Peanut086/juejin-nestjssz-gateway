import { parse } from 'yaml';
import * as process from 'process';

const path = require('path');
const fs = require('fs');

// 获取项目运行环境
export const getEnv = () => {
  return process.env.RUNNING_ENV;
};

// 获取对应环境下的配置
export const getConfig = () => {
  try {
    const envTag = getEnv();
    const yamlPath = path.join(process.cwd(), `./.config/.${envTag}.yaml`);
    const file = fs.readFileSync(yamlPath, 'utf-8');
    console.log('Peanut console...😏😣😆😁🤣😂\n', envTag);
    return parse(file);
  } catch (e) {
    console.log('Peanut console...😏😣😆😁🤣😂\n', e);
  }
};
