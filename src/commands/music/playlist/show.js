const { stripIndents } = require('common-tags');
const { Command, Argument } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const paginate = require('../../../util/paginate');
const timeString = require('../../../util/timeString');
module.exports = class PlaylistShowCommand extends Command {
	constructor() {
		super('playlist-show', {
			description: {
				content: 'Displays songs from a playlist.',
				usage: '<playlist> [page]'
			},
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS'],
			ratelimit: 2,
			args: [
				{
					id: 'playlist',
					type: 'playlist',
					prompt: {
						start: message => `${message.author}, What playlist do you want information on?`,
						retry: (message, { failure }) => `${message.author}, a playlist with the name **${failure.value}** does not exist.`
					}
				},
				{
					id: 'page',
					match: 'rest',
					type: Argument.compose((_, str) => str.replace(/\s/g, ''), Argument.range(Argument.union('number', 'emojint'), 1, Infinity)),
					default: 1
				}
			]
		});
	}

	async exec(message, { playlist, page }) {
		if (!playlist.tracks.length) { return message.util.send('This playlist has no songs!'); }
		const decoded = await this.client.music.decode(playlist.tracks);
		const totalLength = decoded.reduce((prev, song) => prev + song.info.length, 0);
		const paginated = paginate(decoded, page);
		let index = (paginated.page - 1) * 10;
		const embed = new MessageEmbed()
			.setColor(0x5e17eb)
			.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
			.setDescription(stripIndents`
				**Song list${paginated.page > 1 ? `, page ${paginated.page}` : ''}**

				${paginated.items.map(song => `**${++index}.** [${song.info.title}](${song.info.uri}) (${timeString(song.info.length)})`).join('\n')}

				**Total list time:** ${timeString(totalLength)}
			`);
		if (paginated.maxPage > 1) {
			embed.setFooter('Use playlist show <playlist> <page> to view a specific page.');
		}
		return message.util.send(embed);
	}
};
