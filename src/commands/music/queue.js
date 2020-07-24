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
			channel: 'guild',
			args: [
				{
					id: 'page',
					match: 'content',
					type: Argument.compose((msg, str) => str.replace(/\s/g, ''), Argument.range(Argument.union('number', 'emojint'), 1, Infinity)),
					default: 1
				}
			]
		});
	}

	async exec(message, { page }) {
		const queue = this.client.music.queues.get(message.guild.id);
		const current = await queue.current();
		const tracks = [(current || { track: null }).track].concat(await queue.tracks()).filter(track => track);
		if (!tracks.length) {
			const embed = new MessageEmbed()
				.setColor(0x5e17eb)
				.setAuthor(`Queue for ${message.guild.name}`, message.guild.iconURL())
				.setDescription('No more songs in Queue');
			return message.util.send({ embed });
		}

		const decoded = await this.client.music.decode(tracks);
		const totalLength = decoded.filter(track => !track.info.isStream).reduce((prev, song) => prev + song.info.length, 0);
		let pagesNum = Math.ceil(decoded.length / 10);
		if (pagesNum === 0) pagesNum = 1;
		const paginated = paginate(decoded.slice(1), page);
		let index = (paginated.page - 1) * 10;
		const pages = [];
		for (let i = 0; i < pagesNum; i++) {
			const str = decoded.slice(i * 10, (i * 10) + 10).join('');
			const embed = new MessageEmbed()
				.setAuthor(`Queue - ${message.guild.name}`, message.guild.iconURL())
				.setColor(0x5e17eb)
				.setDescription([
					'🎵 **Now Playing**',
					`[${decoded[0].info.title}](${decoded[0].info.uri}) (${timeString(current.position)}/${decoded[0].info.isStream ? '∞' : timeString(decoded[0].info.length)})`,
					'',
					decoded.length
						? stripIndents`🎶 **Current Queue${paginated.maxPage > 1 ? `, Page ${paginated.page}/${paginated.maxPage}` : ''}**
				${paginated.items.map(song => `**${++index}.** [${song.info.title}](${song.info.uri}) (${song.info.isStream ? '∞' : timeString(song.info.length)})`).join('\n')}

				**Total Queue Time:** ${timeString(totalLength)}, **Song${decoded.length > 1 || decoded.length === 0 ? 's' : ''}:** ${decoded.length}`
						: 'No songs in Queue!'
				]);
			pages.push(embed);
		}
		const embed = new MessageEmbed()
			.setColor(0x5e17eb)
			.setAuthor(`Queue for ${message.guild.name}`, message.guild.iconURL())
			.setThumbnail(`https://i.ytimg.com/vi/${decoded[0].info.identifier}/hqdefault.jpg`)
			.setDescription([
				'🎵 **Now Playing**',
				`[${decoded[0].info.title}](${decoded[0].info.uri}) (${timeString(current.position)}/${decoded[0].info.isStream ? '∞' : timeString(decoded[0].info.length)})`,
				'',
				paginated.items.length
					? stripIndents`🎶 **Current Queue${paginated.maxPage > 1 ? `, Page ${paginated.page}/${paginated.maxPage}` : ''}**
				${paginated.items.map(song => `**${++index}.** [${song.info.title}](${song.info.uri}) (${song.info.isStream ? '∞' : timeString(song.info.length)})`).join('\n')}

				**Total Queue Time:** ${timeString(totalLength)}, **Song${decoded.length > 1 || decoded.length === 0 ? 's' : ''}:** ${decoded.length}`
					: 'No songs in Queue!'
			]);

		return message.util.send({ embed });
	}

	async page(message, pages) {
		let page = 0;
		const emojiList = ['⬅', '➡'];
		const msg = await message.channel.send(pages[page]);

		for (const emoji of ['⬅', '➡']) {
			await msg.react(emoji);
		}

		const collector = msg.createReactionCollector(
			(reaction, user) => emojiList.includes(reaction.emoji.name) && user.id === message.author.id,
			{ time: 45000, max: 10 }
		);

		collector.on('collect', reaction => {
			reaction.users.remove(message.author);
			switch (reaction.emoji.name) {
				case emojiList[0]:
					page = page > 0 ? --page : pages.length - 1;
					break;
				case emojiList[1]:
					page = page + 1 < pages.length ? ++page : 0;
					break;
				default:
					break;
			}
			msg.edit(pages[page]);
		});

		collector.on('end', async () => {
			await msg.reactions.removeAll().catch(() => null);
		});

		return msg;
	}
}

module.exports = QueueCommand;
