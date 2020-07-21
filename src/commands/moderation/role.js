const { Command } = require('discord-akairo');
module.exports = class addRoleCommad extends Command {
	constructor() {
		super('role', {
			aliases: ['role', 'changerole'],
			description: {
				content: 'Adds or removes a role',
				usage: '[@user] [role]',
				example: ['@Ayush admin']
			},
			category: 'moderation',
			args: [
				{
					id: 'rMember',
					type: 'member',
					prompt: {
						start: 'Whom would you like to add/remove the role?',
						retry: 'Please enter a valid user.'
					}
				},
				{
					id: 'role',
					type: 'role',
					prompt: {
						start: 'Which role would you like to add/remove ?',
						retry: 'Please enter a valid role.'
					}
				}
			],
			clientPermissions: ['MANAGE_ROLES'],
			userPermissions: ['MANAGE_ROLES']
		});
	}

	async exec(message, { rMember, role }) {
		if (rMember.roles.cache.has(role.id)) {
			await rMember.roles.remove(role.id).catch(e => message.channel.send(e));
			message.channel.send(`The role, ${role.name}, has been removed from ${rMember.displayName}.`);
		} else {
			await rMember.roles.add(role.id).catch(e => message.channel.send(e));
			message.channel.send(`The role, ${role.name}, has been added to ${rMember.displayName}.`);
		}
	}
};
