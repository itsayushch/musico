const { Command } = require('discord-akairo');

class ClearQueueCommand extends Command {
	constructor() {
		super('clear-queue', {
			aliases: ['clearq', 'cq'],
			category: 'music',
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Clears queue.'
			}
		});
	}

	async exec(message) {
		if (!message.member.voice || !message.member.voice.channel) {
			return message.util.send({
				embed: { description: 'You must be connected to a voice channel to use that command!', color: 0x5e17eb }
			});
		}

		const queue = this.client.music.queues.get(message.guild.id);
		await queue.player.stop();
		await queue.clear();

		return message.util.send({
			embed: { author: { name: 'Cleared 🗑' }, color: 0x5e17eb }
		});
	}
}

module.exports = ClearQueueCommand;
