const Colors = {
  Red: "\x1B[31m",
  Yellow: "\x1B[33m",
  Green: "\x1B[32m",
  Blue: "\x1B[34m",
  Purple: "\x1B[38;5;129m",
  Reset: "\x1B[0m",
};

export function log(str: string): void {
  console.log(`${Colors.Purple}[CachesJS]${Colors.Reset} ${str}`);
}

export function warn(str: string): void {
  console.log(`${Colors.Yellow}[CachesJS]${Colors.Reset} ${str}`);
}

export function error(str: string): void {
  console.log(`${Colors.Red}[CachesJS]${Colors.Reset} ${str}`);
}

export function info(str: string): void {
  console.log(`${Colors.Blue}[CachesJS]${Colors.Reset} ${str}`);
}

export function success(str: string): void {
  console.log(`${Colors.Green}[CachesJS]${Colors.Reset} ${str}`);
}
