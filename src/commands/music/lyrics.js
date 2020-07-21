const { Command } = require('discord-akairo');
const fetch = require('node-fetch');
const { Util, MessageEmbed } = require('discord.js');
class LyricsCommand extends Command {
	constructor() {
		super('lyrics', {
			aliases: ['lyrics', 'l', 'lyric'],
			category: 'music',
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Displays lyrics of a song.',
				usage: '<query>',
				examples: ['faded', 'despacito']
			},
			cooldown: 5000,
			args: [
				{
					id: 'query',
					match: 'content',
					type: async (message, query) => {
						if (query) return query.replace(/\[(.+)\]|\((.+)\)|\{(.+)\}/g, '').trim();
						const queue = this.client.music.queues.get(message.guild.id);
						const current = await queue.current();
						if (!current) return null;
						const decoded = await this.client.music.decode(current.track);
						return decoded.title.replace(/\[(.+)\]|\((.+)\)|\{(.+)\}/g, '').trim();
					},
					prompt: {
						start: 'Which song\'s lyrics would you like to search?',
						retry: 'Which song\'s lyrics would you like to search?'
					}
				}
			]
		});
	}

	async exec(message, { query }) {
		await message.util.send({
			embed: { description: `**Searching lyrics for**  \`${query}\``, color: 0x5e17eb }
		});
		const song = await fetch(`http://ec2-18-222-83-60.us-east-2.compute.amazonaws.com/lyrics/${query}`).then(r => r.json());
		if (!song || !song.lyrics) {
			return message.util.send({
				embed: {
					author: { name: 'I couldn\'t find anything!' },
					description: `**Query:** \`${query}\``,
					color: 'RED',
					footer: { text: 'Make your search more specific and try again' }
				}
			});
		}

		const embed = new MessageEmbed()
			.setColor(0x5e17eb)
			.setAuthor('Lyrics')
			.setThumbnail(song.thumbnail ? song.thumbnail.genius : null)
			.setTitle(song.title || 'Unknown')
			.setURL();

		const result = this.split(song.lyrics);

		if (Array.isArray(result)) {
			if (result.length > 1) {
				embed.setDescription(result[0])
					.addField('\u200b', result[1].substring(0, 1024));
			}
			embed.setDescription(result[0]);

			return message.util.send({ embed });
		}
	}

	split(content) {
		return Util.splitMessage(content, { maxLength: 2048 });
	}
}

module.exports = LyricsCommand;
