/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
const markup = {
	bright: '\x1b[1m',
	reset: '\x1b[0m'
};

const foreground = {
	black: '\x1b[30m',
	blue: '\x1b[34m',
	cyan: '\x1b[36m',
	green: '\x1b[32m',
	magenta: '\x1b[35m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	white: '\x1b[37m'
};

class Logger {
	constructor(client) {
		this.client = client;
	}

	debug(text, { label = '' } = {}) {
		return console.log(`[${this.timestamp()}] ${markup.bright}${foreground.yellow}[DEBUG]${markup.reset} » ${label ? `[${label}] ` : ''}${text}`);
	}

	info(text, { label = '' } = {}) {
		return console.log(`[${this.timestamp()}] ${markup.bright}${foreground.cyan}[INFO]${markup.reset} » ${label ? `[${label}] ` : ''}${text}`);
	}

	log(text, { label = '' } = {}) {
		return console.log(`[${this.timestamp()}] ${markup.bright}${foreground.green}[INFO]${markup.reset} » ${label ? `[${label}] ` : ''}${text}`);
	}

	warn(text, { label = '' } = {}) {
		return console.log(`[${this.timestamp()}] ${markup.bright}${foreground.magenta}[WARN]${markup.reset} » ${label ? `[${label}] ` : ''}${text}`);
	}

	error(text, { label = '' } = {}) {
		return console.log(`[${this.timestamp()}] ${markup.bright}${foreground.red}[ERROR]${markup.reset} » ${label ? `[${label}] ` : ''}${text}`);
	}

	shard() {
		return this.client.shard.ids ? `[SHARD ${this.client.shard.ids.join(' ')}]` : '';
	}

	timestamp() {
		const {
			date, month, year, hour, min, sec
		} = this.date();
		return `${[date, month, year].join('-')} ${[hour, min, sec].join(':')}`;
	}

	date() {
		const date = new Date();
		return {
			date: date.getDate()
				.toString()
				.padStart(2, '0'),
			month: (date.getMonth() + 1)
				.toString()
				.padStart(2, '0'),
			year: date.getFullYear()
				.toString()
				.padStart(2, '0'),
			hour: date.getHours()
				.toString()
				.padStart(2, '0'),
			min: date.getMinutes()
				.toString()
				.padStart(2, '0'),
			sec: date.getSeconds()
				.toString()
				.padStart(2, '0')
		};
	}
}

module.exports = Logger;
