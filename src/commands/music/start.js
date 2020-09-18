const { Command } = require('discord-akairo');

class StartCommand extends Command {
	constructor() {
		super('start', {
			aliases: ['start'],
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Joins and starts the Queue.',
				usage: '',
				examples: ['']
			},
			category: 'music',
			channel: 'guild'
		});
	}

	async exec(message) {
		if (!message.member.voice || !message.member.voice.channel) {
			return message.util.send({
				embed: { description: 'You must be connected to a voice channel to use that command!', color: 11642864 }
			});
		} else if (!message.member.voice.channel.joinable) {
			return message.util.send({
				embed: { description: 'I don\'t have permission to **connect** to this voice channel!', color: 11642864 }
			});
		} else if (!message.member.voice.channel.speakable) {
			return message.util.send({
				embed: { description: 'I don\'t have permission to **speak** in this voice channel!', color: 11642864 }
			});
		}

		const queue = await this.client.music.queues.get(message.guild.id);
		if (!message.guild.me.voice || !message.guild.me.voice.channel) {
			await queue.player.join(message.member.voice.channel.id);
		}

		if (!await queue.player.playing) await queue.start();

		return message.util.send({
			embed: { author: { name: 'Started ▶' }, color: 11642864 }
		});
	}
}

module.exports = StartCommand;
