const { Command } = require('discord-akairo');

class RemoveMemberLogCommand extends Command {
	constructor() {
		super('delete-memberlog', {
			description: {
				content: {
					description: 'Remove the member log channel'
				}
			},
			channel: 'guild',
			userPermissions: ['MANAGE_GUILD'],
			ratelimit: 2
		});
	}

	async exec(message) {
		this.client.settings.delete(message.guild.id, 'member-log');
		return message.util.send('The member-log channel has been sucessfully deleted');
	}
}
module.exports = RemoveMemberLogCommand;
