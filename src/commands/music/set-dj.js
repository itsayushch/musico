const { Command } = require('discord-akairo');

class SetDJRoleCommand extends Command {
	constructor() {
		super('set-dj', {
			aliases: ['set-dj'],
			description: {
				content: 'Sets the DJ role many of the commands use for permission checking.',
				usage: '<role>',
				examples: ['dj @DJ', 'dj DJ']
			},
			category: 'music',
			channel: 'guild',
			userPermissions: ['MANAGE_GUILD'],
			args: [
				{
					id: 'role',
					type: 'role',
					match: 'content',
					prompt: {
						start: 'What role you want to set?',
						retry: 'Please provide a valid role!'
					}
				}
			]
		});
	}

	async exec(message, { role }) {
		await this.client.settings.set(message.guild.id, 'djRole', role.id);
		return message.util.reply(`Set DJ role to **${role.name}**`);
	}
}

module.exports = SetDJRoleCommand;
