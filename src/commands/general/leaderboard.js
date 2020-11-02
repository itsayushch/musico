const { Command, Argument } = require('discord-akairo');
const paginate = require('../../util/paginate');

module.exports = class extends Command {
	constructor() {
		super('leaderboard', {
			aliases: ['leaderboard'],
			category: 'general',
			description: {
				content: ''
			}
		});
	}

	async exec(message) {
		let page = 1;
		const leaderboard = await this.client.levels.getLeaderboard();
		let paginated = paginate(leaderboard, page, 20);
		let rank = (paginated.page - 1) * 10;
		let str = '\`## LEVEL USER                      \`\n';
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

		const msg = await message.util.send({ embed });
		if (paginated.maxPage <= 1) return;

		for (const emoji of ['⬅', '➡']) {
			await msg.react(emoji);
		}
		const collector = msg.createReactionCollector(
			(reaction, user) => ['⬅', '➡'].includes(reaction.emoji.name) && user.id === message.author.id,
			{ time: 45000, max: 10 }
		);

		collector.on('collect', async reaction => {
			if (reaction.emoji.name === '➡') {
				page++;
				if (page < 1) page = paginated.maxPage;
				if (page > paginated.maxPage) page = 1;
				paginated = paginate(leaderboard, page, 20);
				rank = (paginated.page - 1) * 10;
				await msg.edit({
					embed: this.client.util.embed()
						.setColor(11642864)
						.setAuthor(`Leaderboard for ${message.guild.name}`, message.guild.iconURL())
						.setDescription(str)
						.setFooter(paginated.page > 1 ? `, page ${paginated.page}` : '')

				});
				await reaction.users.remove(message.author.id);
				return message;
			}

			if (reaction.emoji.name === '⬅') {
				page--;
				if (page < 1) page = paginated.maxPage;
				if (page > paginated.maxPage) page = 1;
				paginated = paginate(leaderboard, page, 20);
				rank = (paginated.page - 1) * 10;
				await msg.edit({
					embed: this.client.util.embed()
						.setColor(11642864)
						.setAuthor(`Leaderboard for ${message.guild.name}`, message.guild.iconURL())
						.setDescription(str)
						.setFooter(paginated.page > 1 ? `, page ${paginated.page}` : '')

				});
				await reaction.users.remove(message.author.id);
				return message;
			}
		});

		collector.on('end', async () => {
			await msg.reactions.removeAll();
			return message;
		});
		return message;
	}
};

