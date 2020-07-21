const { Command } = require('discord-akairo');

class BlacklistCommand extends Command {
	constructor() {
		super('pr', {
			aliases: ['premium', 'pr'],
			description: {
				content: 'Bla Bla',
				usage: '<user>',
				examples: ['@Ayush', '81440962496172032']
			},
			category: 'util',
			ownerOnly: true,
			ratelimit: 2,
			args: [
				{
					id: 'user',
					match: 'content',
					type: 'user',
					prompt: {
						start: 'who would you like to make premium?'
					}
				}
			]
		});
	}

	exec(message, { user }) {
		const premium = this.client.settings.get('global', 'premium', []);
		if (premium.includes(user.id)) {
			const index = premium.indexOf(user.id);
			premium.splice(index, 1);
			if (premium.length === 0) this.client.settings.delete('global', 'blacklist');
			else this.client.settings.set('global', 'premium', premium);

			return message.util.send(`**${user.tag}** has been removed from the blacklist.`);
		}

		premium.push(user.id);
		this.client.settings.set('global', 'premium', premium);

		return message.util.send(`**${user.tag}** has been added to premium users.`);
	}
}

module.exports = BlacklistCommand;
