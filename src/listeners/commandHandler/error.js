const Logger = require('../../util/logger');
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

	async exec(error, message, command) {
		Sentry.init({ dsn: process.env.SENTRY });

		const tag = message.guild ? `${message.guild.name} - ${message.guild.id}/${message.author.tag} - ${message.author.id}` : `${message.author.tag}`;

		Logger.error(`${command.id} ~ ${error.toString()}`, { tag });
		Sentry.captureException(error);

		const embed = this.client.util.embed()
			.setColor(0xFF0000)
			.setAuthor('Something went wrong', 'https://cdn.discordapp.com/emojis/724585245193535521.gif', 'https://discord.com/invite/sY57ftY')
			.setDescription([
				'<:error:702558845142171648> An error has occured. Please report the error to our support staff.',
				'<:logo:702556389985353738> https://discord.com/invite/sY57ftY',
				`\`\`\`js\n${error.toString()}\`\`\``
			]);
		return message.util.send(embed);
	}
}

module.exports = ErrorListener;
