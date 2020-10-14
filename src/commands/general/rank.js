const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');
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

		const embed = this.client.util.embed()
			.setColor(11642864)
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.setDescription(stripIndents`
				**Level:** \`${score.level.toString()}\`
				**Exp:** \`${score.experience.toString()}\`
			`)

		return message.channel.send({ embed });
	}
};

