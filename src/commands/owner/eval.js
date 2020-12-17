const { Command, Flag, Argument } = require('discord-akairo');
const { Util } = require('discord.js');
const util = require('util');
const fetch = require('node-fetch');

class EvalCommand extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval', 'e'],
			category: 'owner',
			optionFlags: ['--depth', '-d'],
			description: {
				content: 'You can\'t use this anyway, so why explain?',
				usage: '<code>'
			}
		});

		this.eval = null;
	}

	*args() {
		const depth = yield {
			match: 'option',
			type: Argument.range('integer', 0, 3, true),
			flag: ['--depth', '-d'],
			default: 0
		};

		const code = yield {
			match: 'rest',
			type: (msg, code) => {
				if (!code) return Flag.cancel();
				return code;
			}
		};

		return { code, depth };
	}

	async exec(message, { code, depth }) {
		let hrDiff;
		if (!this.client.isOwner(message.author.id)) return this.safeEval(message, code, depth);
		try {
			const hrStart = process.hrtime();
			this.eval = eval(code); // eslint-disable-line
			hrDiff = process.hrtime(hrStart);
		} catch (error) {
			return message.util.send(`**Error While Evaluating** \n\`\`\`js\n${error}\n\`\`\``);
		}

		this.hrStart = process.hrtime();
		const result = this.result(await this.eval, hrDiff, code, depth);
		if (Array.isArray(result)) return result.map(async res => message.util.send(res));
		return message.util.send(result);
	}

	result(result, hrDiff, input, depth) {
		const inspected = util.inspect(result, { depth }).replace(new RegExp('!!NL!!', 'g'), '\n').replace(this.replaceToken, '--🙄--');
		const split = inspected.split('\n');
		const last = inspected.length - 1;
		const prependPart = inspected[0] !== '{' && inspected[0] !== '[' && inspected[0] !== '\'' ? split[0] : inspected[0];
		const appendPart = inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== '\'' ? split[split.length - 1] : inspected[last];
		const prepend = `\`\`\`js\n${prependPart}\n`;
		const append = `\n${appendPart}\n\`\`\``;
		if (input) {
			return Util.splitMessage(`*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms* \`\`\`js\n${inspected}\`\`\``, {
				maxLength: 1900, prepend, append
			});
		}
		return Util.splitMessage(`*Callback executed after ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms* \`\`\`js\n${inspected}\`\`\``, {
			maxLength: 1900, prepend, append
		});
	}

	async safeEval(message, code, depth) {
		const data = await fetch(`https://now-eval-api.vercel.app?depth=${depth}&code=${encodeURIComponent(code)}`)
			.then(res => res.text());
		return message.channel.send(data, { code: 'js', split: true });
	}

	get replaceToken() {
		if (!this._replaceToken) {
			const token = this.client.token.split('').join('[^]{0,2}');
			const revToken = this.client.token.split('').reverse().join('[^]{0,2}');
			Object.defineProperty(this, '_replaceToken', { value: new RegExp(`${token}|${revToken}`, 'g') });
		}
		return this._replaceToken;
	}
}

module.exports = EvalCommand;
