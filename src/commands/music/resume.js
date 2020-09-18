const { Command } = require('discord-akairo');

class ResumeCommand extends Command {
	constructor() {
		super('resume', {
			aliases: ['resume'],
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Resumes the queue.'
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
		}

		const queue = this.client.music.queues.get(message.guild.id);
		if (!queue.player.paused) {
			return message.util.send({
				embed: { description: 'Player isn\'t not Paused!', color: 11642864 }
			});
		}
		await queue.player.pause(false);

		return message.util.send({
			embed: { author: { name: 'Resumed ▶' }, color: 11642864 }
		});
	}
}

module.exports = ResumeCommand;
