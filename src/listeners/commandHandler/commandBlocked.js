/* eslint-disable consistent-return */
const { Listener } = require('discord-akairo');

class CommandBlockedListener extends Listener {
	constructor() {
		super('commandBlocked', {
			event: 'commandBlocked',
			emitter: 'commandHandler',
			category: 'commandHandler'
		});
	}

	exec(message, command, reason) {
		const text = {
			guild: () => 'You must be in a guild to use this command.'
		}[reason];

		const level = message.guild ? `${message.guild.name}/${message.author.tag}` : `${message.author.tag}`;

		if (!text) return;
		if (message.guild ? message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES') : true) {
			return message.channel.send(text());
		}
	}
}

module.exports = CommandBlockedListener;
