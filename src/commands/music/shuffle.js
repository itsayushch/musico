const { Command } = require('discord-akairo');

class ShuffleCommand extends Command {
	constructor() {
		super('shuffle', {
			aliases: ['shuffle'],
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Shuffles the queue.'
			},
			category: 'music',
			channel: 'guild'
		});
	}

	async exec(message) {
		if (!message.member.voice || !message.member.voice.channel) {
			return message.util.send({
				embed: { description: 'You must be connected to a voice channel to use that command!', color: 0x5e17eb }
			});
		}

		const queue = this.client.music.queues.get(message.guild.id);
		await queue.shuffle();

		return message.util.send({
			embed: { author: { name: 'Shuffled 🔀' }, color: 0x5e17eb }
		});
	}
}

module.exports = ShuffleCommand;
