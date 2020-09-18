const { Command } = require('discord-akairo');

class StopCommand extends Command {
	constructor() {
		super('stop', {
			aliases: ['stop'],
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Stops and clears the queue.'
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

		const DJ = message.member.roles.cache.has(this.client.settings.get(message.guild.id, 'djRole', undefined)) || message.member.permissions.has('MANAGE_CHANNELS');		const queue = this.client.music.queues.get(message.guild.id);
		if (DJ) await queue.stop();
		else await queue.player.pause();

		return message.util.send({
			embed: { author: { name: `${DJ ? 'Stopped ⏹' : 'Paused ⏸'}` }, color: 11642864 }
		});
	}
}

module.exports = StopCommand;
