const { Command } = require('discord-akairo');
module.exports = class PlaylistDeleteCommand extends Command {
	constructor() {
		super('playlist-delete', {
			description: {
				content: 'Deletes a playlist.',
				usage: '<playlist>'
			},
			channel: 'guild',
			ratelimit: 2,
			args: [
				{
					id: 'playlist',
					match: 'content',
					type: 'playlist',
					prompt: {
						start: message => `${message.author}, What playlist do you want to delete?`,
						retry: (message, { failure }) => `${message.author}, a playlist with the name **${failure.value}** does not exist.`
					}
				}
			]
		});
	}

	async exec(message, { playlist }) {
		if (playlist.user !== message.author.id) { return message.util.reply('You can only delete your own playlists.'); }
		await this.client.playlist.remove(playlist.name);
		return message.util.send({
			embed: {
				color: 0x5e17eb,
				description: `Successfully delted **${playlist.name}**.`
			}
		});
	}
};
