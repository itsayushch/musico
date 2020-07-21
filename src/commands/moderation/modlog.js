const { Command } = require('discord-akairo');

class SetModLogCommand extends Command {
	constructor() {
		super('set-modlog', {
			description: {
				content: {
					description: 'Sets a channel to log moderation event',
					usage: '<channel>',
					examples: ['#mod-log', 'mod-log']
				}

			},
			channel: 'guild',
			userPermissions: ['MANAGE_GUILD'],
			ratelimit: 2,
			args: [
				{
					id: 'channel',
					match: 'content',
					type: 'textChannel',
					default: message => message.channel
				}
			]
		});
	}

	async exec(message, { channel }) {
		this.client.settings.set(message.guild.id, 'mod-log', channel.id);
		return message.util.send(`The current mod-log channel has been set to ${channel}`);
	}
}
module.exports = SetModLogCommand;
