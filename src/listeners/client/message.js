const { Listener } = require('discord-akairo');

class Message extends Listener {
	constructor() {
		super('message', {
			event: 'message',
			emitter: 'client',
			category: 'client'
		});
	}

	async exec(message) {
		if (!message.guild || message.guild.id !== '694554848758202451' || message.author.bot) return;
		await this.client.levels.giveGuildUserExp(message.member, message);
	}
}

module.exports = Message;
