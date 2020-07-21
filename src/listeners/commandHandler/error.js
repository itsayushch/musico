
const { Listener } = require('discord-akairo');
const Sentry = require('@sentry/node');
class ErrorListener extends Listener {
	constructor() {
		super('error', {
			emitter: 'commandHandler',
			event: 'error',
			category: 'commandHandler'
		});
	}

	//
	async exec(error, message) {
		Sentry.init({ dsn: process.env.SENTRY });
		await message.channel.send([
			'<:error:702558845142171648> Something went wrong, report us!',
			'<:logo:702556389985353738> https://discord.com/invite/sY57ftY',
			`\`\`\`${error.toString()}\`\`\``
		]);
		console.log(error);
		Sentry.captureException(error);
	}
}

module.exports = ErrorListener;
