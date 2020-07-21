const { Command } = require('discord-akairo');
const { Util } = require('discord.js');
module.exports = class PlaylistEditCommand extends Command {
	constructor() {
		super('playlist-edit', {
			description: {
				content: 'Edits the description of a playlist.',
				usage: '<playlist> <info>'
			},
			channel: 'guild',
			ratelimit: 2,
			args: [
				{
					id: 'playlist',
					type: 'playlist',
					prompt: {
						start: message => `${message.author}, What playlists description do you want to edit?`,
						retry: (message, { failure }) => `${message.author}, a playlist with the name **${failure.value}** does not exist.`
					}
				},
				{
					id: 'info',
					match: 'rest',
					type: 'string',
					prompt: {
						start: message => `${message.author}, What should the new description be?`
					}
				}
			]
		});
	}

	async exec(message, { playlist, info }) {
		if (playlist.user !== message.author.id) { return message.util.reply('You can only edit your own playlists.'); }
		playlist.description = Util.cleanContent(info, message);
		await this.client.playlist.edit(playlist.name, playlist.description);
		return message.util.send({
			embed: {
				color: 0x5e17eb,
				description: `Successfully updated the description for **${playlist.name}**.`
			}
		});
	}
};
