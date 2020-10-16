const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');
const ProgressBar = require('../../util/bar');

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
		const userData = await this.client.mongo.db('musico').collection('levels').findOne({ user: user.id });

		if (!userData) {
			return message.util.send({
				color: 0xFF0000,
				description: `${user.toString()} do not have any exp. Start chatting to earn the.`
			});
		}
		const currentLevel = this.client.levels.getLevelFromExp(userData.exp);
		const levelExp = this.client.levels.getLevelExp(currentLevel);
		const currentLevelExp = this.client.levels.getLevelProgress(userData.exp);

		const progress = new ProgressBar(currentLevelExp, levelExp, 15);

		const embed = this.client.util.embed()
			.setColor(11642864)
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.setDescription(stripIndents`
				**Level:** \`${currentLevel}\`
				**Exp:** \`${currentLevelExp + userData.exp} / ${levelExp + userData.exp}\`
				${progress.createBar(message, false)}
			`);

		return message.channel.send({ embed });
	}
};

