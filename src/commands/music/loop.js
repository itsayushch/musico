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

		if (this.client.repeat.get(message.guild.id)) {
			this.client.repeat.set(message.guild.id, false);
			return message.util.send({
				embed: { author: { name: 'Disabled 🔁' }, color: 0x5e17eb }
			});
		}
		this.client.repeat.set(message.guild.id, true);
		return message.util.send({
			embed: { author: { name: 'Enabled 🔁' }, color: 0x5e17eb }
		});
	}
}

module.exports = LoopCommand;
