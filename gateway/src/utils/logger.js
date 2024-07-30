import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export default class Logger {
  constructor({ moduleName, logPath }) {
    this.module = moduleName ?? 'Logger';
    this.dir = path.dirname(fileURLToPath(import.meta.url));;
    this.filePath = logPath ?? null;
  }

  get time() {
    return new Date().getTime();
  }

  get datetime() {
    return new Date().toISOString();
  }

  set logPath(logFilePath) {
    this.filePath = logFilePath;
  }

  error(...props) {
    console.log(`${this.datetime}:`, `[${this.module}]`, ...props);
  }

  log(...props) {
    console.log(`${this.datetime}:`, `[${this.module}]`, ...props);
  }

  warning(...props) {
    console.warn(this.time, `[${this.module}]`, ...props);
  }

  info(...props) {
    console.info(this.time, `[${this.module}]`, ...props);
  }

  debug(...props) {
    console.debug(this.time, `[${this.module}]`, ...props);
  }

  write(log) {
    if (this.filePath === null) throw new Error(`[${this.module}]: Log file path is not specified.`);

    try {
      JSON.parse(log);
    } catch (e) {
      log = JSON.stringify(log);
    }

    try {
      if (!fs.existsSync(this.filePath)) {
        fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
      }
      return fs.writeFileSync(this.filePath, `${this.datetime}: ${log}\n`);
    } catch (e) {
      throw new Error(`[${this.module}]: ${e.message}`);
    }
  }

  append(log) {
    if (this.filePath === null) throw new Error(`[${this.module}]: Log file path is not specified.`);

    try {
      JSON.parse(log);
    } catch (e) {
      log = JSON.stringify(log);
    }

    try {
      if (!fs.existsSync(this.filePath)) {
        fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
      }
      return fs.appendFileSync(this.filePath, `${this.datetime}: ${log}\n`);
    } catch (e) {
      throw new Error(`[${this.module}]: ${e.message}`);
    }
  }

  async timer(callback, label) {
    if (typeof callback !== 'function') throw new Error(`${this.module}: Callback is not a function.`);
    const start = new Date().getTime();
    const result = await callback();
    const end = new Date().getTime();
    console.log(`${label}: ${(end - start) / 1000} sec`);
    return result;
  }

  exception(message) {
    return new Error(`${this.module}: ${message}`);
  }
};
