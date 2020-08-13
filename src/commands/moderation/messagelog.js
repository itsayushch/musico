const { Command } = require('discord-akairo');

class SetModLogCommand extends Command {
	constructor() {
		super('set-messagelog', {
			description: {
				content: {
					description: 'Sets a channel to log message delete and edit events'
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
		await this.client.settings.set(message.guild.id, 'message-log', channel.id);
		return message.util.send(`The current message-log channel has been set to ${channel}`);
	}
}
module.exports = SetModLogCommand;
