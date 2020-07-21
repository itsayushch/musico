const { Command } = require('discord-akairo');
class PingCommand extends Command {
	constructor() {
		super('ping', {
			aliases: ['ping', 'pong'],
			category: 'general',
			description: { content: 'Pings me.' }
		});
	}

	async exec(message) {
		const sent = await message.util.reply('Pong!');
		const sentTime = sent.editedTimestamp || sent.createdTimestamp;
		const startTime = message.editedTimestamp || message.createdTimestamp;
		return message.util.send(`*Gateway* **(${sentTime - startTime}** ms)\n*API* **(${this.client.ws.ping}) ms**`);
	}
}

module.exports = PingCommand;
