const { Command } = require('discord-akairo');

class SetModLogCommand extends Command {
	constructor() {
		super('set-memberlog', {
			description: {
				content: {
					description: 'Sets a channel to log join and leave events',
					usage: '<channel>',
					examples: ['#member-log', 'member-log']
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
		await this.client.settings.set(message.guild.id, 'member-log', channel.id);
		return message.util.send(`The current member-log channel has been set to ${channel}`);
	}
}
module.exports = SetModLogCommand;
