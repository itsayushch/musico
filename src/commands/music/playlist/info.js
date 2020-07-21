const { Command } = require('discord-akairo');
const moment = require('moment');
require('moment-duration-format');
module.exports = class PlaylistInfoCommand extends Command {
	constructor() {
		super('playlist-info', {
			description: {
				content: 'Displays information about a playlist.',
				usage: '<playlist>'
			},
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS'],
			ratelimit: 2,
			args: [
				{
					id: 'playlist',
					match: 'content',
					type: 'playlist',
					prompt: {
						start: message => `${message.author}, What playlist do you want information on?`,
						retry: (message, { failure }) => `${message.author}, a playlist with the name **${failure.value}** does not exist.`
					}
				}
			]
		});
	}

	async exec(message, { playlist }) {
		const user = await this.client.users.cache.get(playlist.user);
		const guild = this.client.guilds.cache.get(playlist.guild);
		const embed = this.client.util.embed()
			.setColor(0x5e17eb)
			.addField('❯ Name', playlist.name)
			.addField('❯ Description', playlist.description ? playlist.description.substring(0, 1020) : 'No description.')
			.addField('❯ User', user ? `${user.tag} (ID: ${user.id})` : 'Couldn\'t fetch user.')
			.addField('❯ Guild', guild ? `${guild.name}` : 'Couldn\'t fetch guild.')
			.addField('❯ Songs', playlist.tracks.length || 'No songs.')
			.addField('❯ Plays', playlist.plays)
			.addField('❯ Created at', moment.utc(playlist.createdAt).format('DD/MM/YYYY hh:mm:ss'))
			.addField('❯ Modified at', moment.utc(playlist.updatedAt).format('DD/MM/YYYY hh:mm:ss'));
		return message.util.send(embed);
	}
};
