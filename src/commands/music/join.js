const { Command } = require('discord-akairo');

class JoinCommand extends Command {
	constructor() {
		super('join', {
			aliases: ['join'],
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Summons the bot to your voice channel.',
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

		const queue = this.client.music.queues.get(message.guild.id);
		if (!message.guild.me.voice.channel || message.guild.me.voice.channel !== message.member.voice.channel) {
			await queue.player.join(message.member.voice.channel.id);
		}

		return message.util.send({
			embed: { description: `Connected to **${message.member.voice.channel.name}**`, color: 11642864 }
		});
	}
}

module.exports = JoinCommand;
