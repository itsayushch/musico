const { stripIndents } = require('common-tags');
const { Command, Argument } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const paginate = require('../../../util/paginate');

module.exports = class PlaylistListCommand extends Command {
	constructor() {
		super('playlist-list', {
			aliases: ['playlists'],
			category: 'music',
			description: {
				content: 'Displays all playlists (from a specific user).',
				usage: '[member]'
			},
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS'],
			ratelimit: 2,
			args: [
				{
					id: 'member',
					type: 'member'
				},
				{
					id: 'page',
					type: Argument.compose((_, str) => str.replace(/\s/g, ''), Argument.range(Argument.union('number', 'emojint'), 1, Infinity))
				}
			]
		});
	}

	async exec(message, { member, page }) {
		const where = member ? { user: member.id, guild: message.guild.id } : { guild: message.guild.id };
		const playlists = await this.client.mongo.db('musico').collection('playlist').find(where).toArray();
		if (!playlists) {
			return message.util.send(`${member ? `${member.displayName}` : `${message.guild.name}`} doesn't have any playlists.`);
		}
		const paginated = paginate(playlists, page);
		const embed = new MessageEmbed()
			.setColor(11642864)
			.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
			.setDescription(stripIndents`
				**Playlists${paginated.page > 1 ? `, page ${paginated.page}` : ''}**

				${paginated.items.map(playlist => `** • ** ${playlist.name}`).join('\n')}
			`);
		if (paginated.maxPage > 1) { embed.setFooter('Use playlist list <member> <page> to view a specific page.'); }
		return message.util.send(embed);
	}
};
