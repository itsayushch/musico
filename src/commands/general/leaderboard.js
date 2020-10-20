const { Command, Argument } = require('discord-akairo');
const paginate = require('../../util/paginate');

module.exports = class extends Command {
	constructor() {
		super('leaderboard', {
			aliases: ['leaderboard'],
			category: 'general',
			description: {
				content: ''
			},
			args: [
				{
					id: 'page',
					match: 'rest',
					type: Argument.compose((_, str) => str.replace(/\s/g, ''), Argument.range(Argument.union('number', 'emojint'), 1, Infinity)),
					default: 1
				}
			]
		});
	}

	async exec(message, { page }) {
		const leaderboard = await this.client.levels.getLeaderboard();
		const paginated = paginate(leaderboard, page);
		let rank = (paginated.page - 1) * 10;
		let str = '\`## LEVEL USER                          \`\n';
		for (const items of leaderboard) {
			const user = await this.client.users.fetch(items.user);
			const currentLevel = this.client.levels.getLevelFromExp(items.exp);
			str += `\`\u200e${String(++rank).padStart(2, ' ')} \u200e${String(currentLevel).padStart(5, ' ')} ${user.username.substring(0, 25).padEnd(26, ' ')}\u200e\`\n`;
		}
		const embed = this.client.util.embed()
			.setColor(11642864)
			.setAuthor(`Leaderboard for ${message.guild.name}`, message.guild.iconURL())
			.setDescription(str)
			.setFooter(paginated.page > 1 ? `, page ${paginated.page}` : '');
		return message.util.send(embed);
	}
};

