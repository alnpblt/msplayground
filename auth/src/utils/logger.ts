import fs from 'fs';
import path from 'path';

export default class Logger {
  private module: string;
  private dir: string;
  private filePath: string | null;
  constructor({ moduleName, logPath }: {moduleName?: string, logPath?: string}) {
    this.module = moduleName ?? 'Logger';
    this.dir = __dirname
    this.filePath = logPath ?? null;
  }

  get time(): number {
    return new Date().getTime();
  }

  get datetime(): string {
    return new Date().toISOString();
  }

  set logPath(logFilePath: string) {
    this.filePath = logFilePath;
  }

  error(...props: any[]): void {
    console.log(`${this.datetime}:`, `[${this.module}]`, ...props);
  }

  log(...props: any[]): void {
    console.log(`${this.datetime}:`, `[${this.module}]`, ...props);
  }

  warning(...props: any[]): void {
    console.warn(this.time, `[${this.module}]`, ...props);
  }

  info(...props: any[]): void {
    console.info(this.time, `[${this.module}]`, ...props);
  }

  debug(...props: any[]): void {
    console.debug(this.time, `[${this.module}]`, ...props);
  }

  write(log: any): void {
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

  append(log: any): void {
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

  async timer(callback: CallableFunction, label: string): Promise<any> {
    if (typeof callback !== 'function') throw new Error(`${this.module}: Callback is not a function.`);
    const start = new Date().getTime();
    const result = await callback();
    const end = new Date().getTime();
    return result;
  }

  exception(message: string): Error {
    return new Error(`${this.module}: ${message}`);
  }
};
