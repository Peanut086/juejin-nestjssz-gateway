import dayjs from 'dayjs';

const split = require('split2');
const chalk = require('chalk');
const JSONparse = require('fast-json-parse');

const levels = {
  '60': 'Fatal',
  '50': 'Error',
  '40': 'Warn',
  '30': 'Info',
  '20': 'Debug',
  '10': 'Trace',
};

const colors = {
  '60': 'red',
  '50': 'red',
  '40': 'yellow',
  '30': 'green',
  '20': 'eol',
  '10': 'cyan',
};

interface ILogStream {
  format?: () => void;
}

export class LogStream {
  public trans: any;
  public customFormat: (arg0: any) => any; // 格式化方法

  constructor(options?: ILogStream) {
    this.trans = split((data: any) => {
      this.log(data);
    });
    this.customFormat = options?.format;
  }

  log(data) {
    data = this.jsonParse(data);
    const level = data.level;
    data = this.format(data);
    console.log(chalk[colors[level]](data));
  }

  jsonParse(data) {
    return JSONparse(data).value;
  }

  /*
   * @description 格式化日志
   * @param {Object} data 日志数据
   * */
  format(data) {
    // 如果有自定义格式化方法，则使用自定义方法
    if (this.customFormat) {
      return this.customFormat(data);
    }

    const level = levels[data.level];
    const time = dayjs(data.time).format('YYYY-MM-DD HH:mm:ss.SSS A');
    const logId = data.reqId || '_logId_';

    let reqInfo = '[-]';

    if (data.req) {
      reqInfo = `[${data.req.remoteAddress || ''} - ${
        data.req.method || ''
      } - ${data.req.url || ''}]`;
    }

    if (data.res) {
      reqInfo = JSON.stringify(data.res);
    }

    // swagger 请求日志不记录
    if (data?.req?.url && data.req.url.indexOf('/api/doc') > -1) {
      return null;
    }

    return `${level}--${time}--${logId}--${reqInfo}--${data.msg}`;
  }
}
