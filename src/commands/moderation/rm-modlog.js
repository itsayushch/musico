const { Command } = require('discord-akairo');

class RemoveMemberLogCommand extends Command {
	constructor() {
		super('delete-modlog', {
			description: {
				content: {
					description: 'Deletes the mod-log channel'
				}
			},
			channel: 'guild',
			userPermissions: ['MANAGE_GUILD'],
			ratelimit: 2
		});
	}

	async exec(message) {
		this.client.settings.delete(message.guild.id, 'mod-log');
		return message.util.send('The mod-log channel has been sucessfully deleted');
	}
}
module.exports = RemoveMemberLogCommand;
