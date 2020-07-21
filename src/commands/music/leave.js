/* eslint-disable no-else-return */
const { Command } = require('discord-akairo');
class LeaveCommand extends Command {
	constructor() {
		super('leave', {
			aliases: ['leave', 'dc'],
			category: 'music',
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Leaves the voice channel.',
				examples: ['']
			}
		});
	}

	async exec(message) {
		if (!message.member.voice || !message.member.voice.channel) {
			return message.util.send({
				embed: { description: 'You must be connected to a voice channel to use that command!', color: 0x5e17eb }
			});
		}

		const DJ = message.member.roles.cache.has(this.client.settings.get(message.guild.id, 'djRole', undefined)) || message.member.permissions.has('MANAGE_CHANNELS');

		const queue = this.client.music.queues.get(message.guild.id);
		if (message.guild.me.voice || message.guild.me.voice.channel) {
			await queue.player.leave();
			await queue.clear();
			await queue.player.destroy();

			return message.util.send({
				embed: { author: { name: 'Left the voice channel!' }, color: 0x5e17eb }
			});
		} else if (!message.guild.me.voice || !message.guild.me.voice.channel) {
			return message.util.send({
				embed: {
					color: 'RED',
					description: 'I am not in a voice channel, so how can I leave ?'
				}
			});
		} else if (!DJ) {
			return message.util.send({
				embed: {
					color: 'RED',
					description: 'You either need the **DJ ROLE** or **MANGE CHANNELS** permissions to use this command'
				}
			});
		}
	}
}

module.exports = LeaveCommand;
