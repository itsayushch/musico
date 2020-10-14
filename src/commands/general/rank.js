const { Command } = require('discord-akairo');

module.exports = class extends Command {
	constructor() {
		super('rank', {
			aliases: ['rank'],
			category: 'general',
			description: {
				content: ''
			},
			args: [
				{
					id: 'user',
					type: 'user',
					default: m => m.author
				}
			]
		});
	}

	async exec(message, { user }) {
		const score = await this.client.settings.get(message.guild.id, user.id, {
            level: 0,
            experience: 0
		});
		
		return message.channel.send({
			embed: {
				color: 11642864,
				description: [
					`**Level:** \`${score.level}\``,
					`**Exp:** \`${score.experience}\``,
				]
			}
		})
	}
};

