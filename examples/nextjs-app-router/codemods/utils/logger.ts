interface PrintOptions {
  newlineBefore?: boolean;
  stream?: 'stdout' | 'stderr';
}

type ColorKey = 'reset' | 'bright' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan';

const COLOR_CODES: Record<ColorKey, string> = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function colorize(message: string, color?: ColorKey): string {
  if (!color) {
    return message;
  }
  return `${COLOR_CODES[color]}${message}${COLOR_CODES.reset}`;
}

export interface LoggerOptions {
  dryRun?: boolean;
}

export class Logger {
  private readonly dryRun: boolean;

  constructor(options: LoggerOptions = {}) {
    this.dryRun = Boolean(options.dryRun);
  }

  line(message = '', newlineBefore = false): void {
    this.print(message, undefined, { newlineBefore });
  }

  info(message: string): void {
    this.print(message, 'cyan');
  }

  detail(message: string): void {
    this.print(message, 'blue');
  }

  success(message: string): void {
    this.print(message, 'green');
  }

  warn(message: string): void {
    this.print(message, 'yellow');
  }

  error(message: string): void {
    this.print(message, 'red', { stream: 'stderr' });
  }

  command(message: string): void {
    this.detail(message);
  }

  dryRunNotice(message: string): void {
    this.print(`[DRY RUN] ${message}`, 'yellow');
  }

  task(message: string): void {
    this.print(message, 'cyan', { newlineBefore: true });
  }

  phase(title: string): void {
    const divider = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    this.print(divider, 'bright', { newlineBefore: true });
    this.print(title, 'bright');
    this.print(divider, 'bright');
  }

  banner(lines: string[], color: ColorKey): void {
    lines.forEach((line, index) => {
      this.print(line, color, { newlineBefore: index === 0 });
    });
  }

  get isDryRun(): boolean {
    return this.dryRun;
  }

  private print(message: string, color?: ColorKey, options: PrintOptions = {}): void {
    const { newlineBefore = false, stream = 'stdout' } = options;
    const output = stream === 'stderr' ? process.stderr : process.stdout;
    if (newlineBefore) {
      output.write('\n');
    }
    output.write(`${colorize(message, color)}\n`);
  }
}
