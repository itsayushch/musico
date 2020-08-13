const { Command } = require('discord-akairo');

class SetModLogCommand extends Command {
	constructor() {
		super('del-messagelog', {
			channel: 'guild',
			userPermissions: ['MANAGE_GUILD']
		});
	}

	async exec(message) {
		await this.client.settings.delete(message.guild.id, 'message-log');
		return message.util.send('The current message-log channel has been deleted');
	}
}
module.exports = SetModLogCommand;
