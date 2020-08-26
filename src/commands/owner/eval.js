const { Command } = require('discord-akairo');
const util = require('util');

class EvalCommand extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval', 'e'],
			ownerOnly: true,
			quoted: false,
			category: 'owner',
			clientPermissions: ['SEND_MESSAGES'],
			args: [
				{
					id: 'code',
					match: 'content',
					prompt: {
						start: 'What would you like to evaluate ?',
						retry: 'Try again.'
					}
				}

			]
		});
	}

	async exec(message, { code }) {
		if (!code) {
			return message.util.send('No code provided!');
		}

		const evaled = {};
		const logs = [];
		const token = this.client.token.split('').join('[^]{0,2}');
		const rev = this.client.token.split('').reverse().join('[^]{0,2}');
		const tokenRegex = new RegExp(`${token}|${rev}`, 'g');
		const cb = '```';
		const print = (...a) => { // eslint-disable-line no-unused-vars
			const cleaned = a.map(obj => {
				if (typeof o !== 'string') obj = util.inspect(obj, { depth: 1 });
				return obj.replace(tokenRegex, '[TERE TOH L LAG GAYE]');
			});

			if (!evaled.output) {
				logs.push(...cleaned);
				return;
			}

			evaled.output += evaled.output.endsWith('\n') ? cleaned.join(' ') : `\n${cleaned.join(' ')}`;
			const title = evaled.errored ? '☠\u2000**Error**' : '📤\u2000**Output**';
			if (evaled.output.length + code.length > 1900) {
				evaled.output = 'Output too long.';
			}

			evaled.message.edit([
				`${title}${cb}js`,
				evaled.output,
				cb
			]);
		};
		let hrDiff;
		try {
			const hrStart = process.hrtime();
			// eslint-disable-next-line no-eval
			let output = eval(code);
			hrDiff = process.hrtime(hrStart);
			// eslint-disable-next-line eqeqeq
			if (output != null && typeof output.then === 'function') {
				output = await output;
			}

			if (typeof output !== 'string') {
				output = util.inspect(output, { depth: 0 });
			}

			output = `${logs.join('\n')}\n${logs.length && output === 'undefined' ? '' : output}`;
			output = output.replace(tokenRegex, '[TERE TOH L LAG GAYE]');
			if (output.length + code.length > 1900) {
				output = 'Output too long.';
			}
			this.hrStart = process.hrtime();
			const sent = await message.util.send(
				[
					`**Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms**`,
					`📤\u2000**Output**${cb}js`,
					output,
					cb
				]
			);

			evaled.message = sent;
			evaled.errored = false;
			evaled.output = output;
			return sent;
		} catch (err) {
			let error = err;
			error = error.toString();
			error = `${logs.join('\n')}\n${logs.length && error === 'undefined' ? '' : error}`;
			error = error.replace(tokenRegex, '[TERE TOH L LAG GAYE]');
			const sent = await message.util.send([
				`☠\u2000**Error**${cb}js`,
				error,
				cb
			]);

			evaled.message = sent;
			evaled.errored = true;
			evaled.output = error;
			return sent;
		}
	}
}

module.exports = EvalCommand;
