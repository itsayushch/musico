const { Argument, Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const paginate = require('../../util/paginate');
const timeString = require('../../util/timeString');
const { stripIndents } = require('common-tags');

class QueueCommand extends Command {
	constructor() {
		super('queue', {
			aliases: ['queue', 'q'],
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Shows you the current queue.',
				usage: '[page]',
				examples: ['1', '3']
			},
			category: 'music',
			channel: 'guild'
		});
	}

	async exec(message) {
		let page = 1;
		const queue = this.client.music.queues.get(message.guild.id);
		const current = Object.assign({ track: null, position: 0 }, await queue.current());
		const tracks = [(current || { track: null }).track].concat(await queue.tracks()).filter(track => track);
		if (!tracks.length) {
			const embed = new MessageEmbed()
				.setColor(11642864)
				.setAuthor(`Queue for ${message.guild.name}`, message.guild.iconURL())
				.setDescription('No more songs in Queue');
			return message.util.send({ embed });
		}

		const decoded = await this.client.music.decode(tracks);
		const totalLength = decoded.slice(1).filter(track => !track.info.isStream).reduce((prev, song) => prev + song.info.length, 0);
		const paginated = paginate(decoded.slice(1), page);
		let index = (paginated.page - 1) * 10;

		const embed = new MessageEmbed()
			.setColor(11642864)
			.setAuthor(`Queue for ${message.guild.name}`, message.guild.iconURL())
			.setThumbnail(`https://i.ytimg.com/vi/${decoded[0].info.identifier}/hqdefault.jpg`)
			.setDescription([
				'**Now Playing**',
				`[${decoded[0].info.title}](${decoded[0].info.uri}) (${timeString(current.position)}/${decoded[0].info.isStream ? '∞' : timeString(decoded[0].info.length)})`,
				'',
				paginated.items.length
					? stripIndents`**Queue${paginated.maxPage > 1 ? `, Page ${paginated.page}/${paginated.maxPage}` : ''}**
				${paginated.items.map(song => `**${++index}.** [${song.info.title}](${song.info.uri}) (${song.info.isStream ? '∞' : timeString(song.info.length)})`).join('\n')}

				**Total Queue Time:** ${timeString(totalLength)}, **Song${decoded.length > 1 || decoded.length === 0 ? 's' : ''}:** ${decoded.length}`
					: 'No more songs in Queue'
			]);

		const msg = await message.util.send({ embed });
		if (paginated.maxPage === 1) return msg;
		for (const emoji of ['⬅️', '➡️']) {
			await msg.react(emoji);
		}

		const collector = msg.createReactionCollector(
			(reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id,
			{ time: 120000, max: 10 }
		);

		collector.on('collect', async reaction => {
			if (reaction.emoji.name === '➡️') {
				page += 1;
				if (page < 1) page = paginated.maxPage;
				if (page > paginated.maxPage) page = 1;
				await msg.edit({
					embed: embed.setFooter(`Page ${this.paginate(decoded.slice(1), page).page}/${paginated.maxPage} (${index} accounts)`)
						.setColor(11642864)
						.setAuthor(`Queue for ${message.guild.name}`, message.guild.iconURL())
						.setThumbnail(`https://i.ytimg.com/vi/${decoded[0].info.identifier}/hqdefault.jpg`)
						.setDescription([
							'**Now Playing**',
							`[${decoded[0].info.title}](${decoded[0].info.uri}) (${timeString(current.position)}/${decoded[0].info.isStream ? '∞' : timeString(decoded[0].info.length)})`,
							'',
							paginated.items.length
								? stripIndents`**Queue${paginated.maxPage > 1 ? `, Page ${paginated.page}/${paginated.maxPage}` : ''}**
							${paginated.items.map(song => `**${++index}.** [${song.info.title}](${song.info.uri}) (${song.info.isStream ? '∞' : timeString(song.info.length)})`).join('\n')}
		
							**Total Queue Time:** ${timeString(totalLength)}, **Song${decoded.length > 1 || decoded.length === 0 ? 's' : ''}:** ${decoded.length}`
								: 'No more songs in Queue'
						])
				});
				await reaction.users.remove(message.author.id);
				return message;
			}

			if (reaction.emoji.name === '⬅️') {
				page -= 1;
				if (page < 1) page = paginated.maxPage;
				if (page > paginated.maxPage) page = 1;
				await msg.edit({
					embed: embed.setColor(11642864)
						.setAuthor(`Queue for ${message.guild.name}`, message.guild.iconURL())
						.setThumbnail(`https://i.ytimg.com/vi/${decoded[0].info.identifier}/hqdefault.jpg`)
						.setDescription([
							'**Now Playing**',
							`[${decoded[0].info.title}](${decoded[0].info.uri}) (${timeString(current.position)}/${decoded[0].info.isStream ? '∞' : timeString(decoded[0].info.length)})`,
							'',
							paginated.items.length
								? stripIndents`**Queue${paginated.maxPage > 1 ? `, Page ${paginated.page}/${paginated.maxPage}` : ''}**
							${paginated.items.map(song => `**${++index}.** [${song.info.title}](${song.info.uri}) (${song.info.isStream ? '∞' : timeString(song.info.length)})`).join('\n')}
		
							**Total Queue Time:** ${timeString(totalLength)}, **Song${decoded.length > 1 || decoded.length === 0 ? 's' : ''}:** ${decoded.length}`
								: 'No more songs in Queue'
						])

				});
				await reaction.users.remove(message.author.id);
				return message;
			}
		});

		collector.on('end', async () => {
			await msg.reactions.removeAll().catch(() => null);
			return message;
		});
		return message;
	}
}

module.exports = QueueCommand;
