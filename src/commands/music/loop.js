const { Command } = require('discord-akairo');

class LoopCommand extends Command {
	constructor() {
		super('loop', {
			aliases: ['loop', 'repeat'],
			category: 'music',
			channel: 'guild',
			clientPermissions: ['USE_EXTERNAL_EMOJIS'],
			description: { content: 'Loops the current song in the queue.' }
		});
	}

	exec(message) {
		if (!message.member.voice || !message.member.voice.channel) {
			return message.util.send({
				embed: { description: 'You must be connected to a voice channel to use that command!', color: 0x0080ff }
			});
		}

		const queue = this.client.music.queues.get(message.guild.id);
		const looping = queue.looping() ? queue.looping(false) : queue.looping(true);
		return message.util.send({
			embed: { author: { name: looping ? 'Enabled 🔁' : 'Disabled 🔁' }, color: 0x5e17eb }
		});
	}
}

module.exports = LoopCommand;
