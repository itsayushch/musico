const { Argument, Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const timeString = require('../../util/timeString');

class SearchCommand extends Command {
	constructor() {
		super('search', {
			aliases: ['search', 'sh'],
			clientPermissions: ['USE_EXTERNAL_EMOJIS'],
			category: 'music',
			channel: 'guild',
			description: {
				content: 'Searches YouTube Songs.',
				usage: '<link/search>',
				examples: ['justin bieber', 'justin bieber']
			},
			args: [
				{
					id: 'query',
					match: 'rest',
					type: Argument.compose('string', (message, str) => str ? str.replace(/<(.+)>/g, '$1') : ''),
					default: ''
				}
			]
		});
	}

	async exec(message, { query }) {
		if (!message.member.voice || !message.member.voice.channel) {
			return message.util.send({
				embed: { description: 'You must be connected to a voice channel to use that command!', color: 'RED' }
			});
		} else if (!message.member.voice.channel.joinable) {
			return message.util.send({
				embed: { description: 'I don\'t have permission to **connect** to this voice channel!', color: 'RED' }
			});
		} else if (!message.member.voice.channel.speakable) {
			return message.util.send({
				embed: { description: 'I don\'t have permission to **speak** in this voice channel!', color: 'RED' }
			});
		}

		const res = await this.client.music.load(`ytsearch:${query}`);
		const queue = this.client.music.queues.get(message.guild.id);
		if (!message.guild.me.voice.channel) await queue.player.join(message.member.voice.channel.id);

		const tracks = res.tracks.slice(0, 10);
		const tracks2 = res.tracks.slice(10, 20);
		const tracks3 = res.tracks.slice(20, 30);
		let song;
		let index = 0;
		let page = 0;
		const emojiList = ['⬅', '➡'];

		if (['TRACK_LOADED', 'SEARCH_RESULT'].includes(res.loadType)) {
			const embed = new MessageEmbed()
				.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
				.setTitle('Search Result')
				.setDescription(`${tracks.map(track => `**${++index}.** [${track.info.title}](${track.info.uri}) (${track.info.isStream ? '∞' : timeString(track.info.length)})`).join('\n\n')}`)
				.setColor(0x5e17eb)
				.setFooter('Enter a number to make choice or `cancel` to exit.');

			const embed2 = new MessageEmbed()
				.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
				.setTitle('Search Result')
				.setDescription(`${tracks2.map(track => `**${++index}.** [${track.info.title}](${track.info.uri}) (${track.info.isStream ? '∞' : timeString(track.info.length)})`).join('\n\n')}`)
				.setColor(0x5e17eb)
				.setFooter('Enter a number to make choice or `cancel` to exit.');

			const embed3 = new MessageEmbed()
				.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
				.setTitle('Search Result')
				.setDescription(`${tracks3.map(track => `**${++index}.** [${track.info.title}](${track.info.uri}) (${track.info.isStream ? '∞' : timeString(track.info.length)})`).join('\n\n')}`)
				.setColor(0x5e17eb)
				.setFooter('Enter a number to make choice or `cancel` to exit.');

			const pages = [
				embed,
				embed2,
				embed3
			];
			const msg = await message.channel.send(pages[page]);

			for (const emoji of emojiList) {
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


			const responses = await message.channel.awaitMessages(
				msg => (msg.author.id === message.author.id && msg.content > 0 && msg.content < 31) ||
				(msg.author.id === message.author.id && msg.content.toLowerCase() === 'cancel'), {
					max: 1,
					time: 30000
				}
			);

			if (!responses || responses.size !== 1) {
				await msg.reactions.removeAll().catch(() => null);
				return msg.edit({
					embed: {
						description: 'Time ran out, command has been cancelled!',
						color: 0x5e17eb
					}
				});
			}

			const response = responses.first();
			if (response.content.toLowerCase() === 'cancel') {
				await msg.reactions.removeAll().catch(() => null);
				return msg.edit({
					embed: {
						description: 'Command has been cancelled!',
						color: 0x5e17eb
					}
				});
			}

			const input = Number(response.content);
			await queue.add(res.tracks[input - 1].track);
			song = {
				author: {
					name: 'Added to queue'
				},
				color: 0x5e17eb,
				description: stripIndents`
				**❯ Song**
				[${res.tracks[input - 1].info.title}](${res.tracks[input - 1].info.uri})

				**❯ Uploaded By**
				${res.tracks[input - 1].info.author}

				**❯ Length**
				${res.tracks[input - 1].info.isStream ? 'Live' : timeString(res.tracks[input - 1].info.length)}
				`,
				thumbnail: {
					url: `https://i.ytimg.com/vi/${res.tracks[input - 1].info.identifier}/hqdefault.jpg`
				}
			};
			await msg.delete();
			await msg.reactions.removeAll().catch(() => null);
			collector.on('end', async () => {
				await msg.reactions.removeAll().catch(() => null);
			});
		} else {
			return message.util.send({
				embed: { description: 'I couldn\'t find What you were looking for!', color: 'RED' }
			});
		}

		if (queue.player.playing === false && queue.player.paused === false) await queue.start();

		return message.util.send({ embed: song });
	}
}

module.exports = SearchCommand;
