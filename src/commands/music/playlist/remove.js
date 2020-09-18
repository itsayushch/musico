const { Command, Argument } = require('discord-akairo');
module.exports = class PlaylistRemoveCommand extends Command {
	constructor() {
		super('playlist-remove', {
			description: {
				content: 'Removes a song from the playlist.',
				usage: '<playlist> <position>'
			},
			channel: 'guild',
			ratelimit: 2,
			args: [
				{
					id: 'playlist',
					type: 'playlist',
					prompt: {
						start: message => `${message.author}, What playlist should this song/playlist be removed from?`,
						retry: (message, { failure }) => `${message.author}, a playlist with the name **${failure.value}** does not exist.`
					}
				},
				{
					id: 'position',
					match: 'rest',
					type: Argument.compose((_, str) => str.replace(/\s/g, ''), Argument.range(Argument.union('number', 'emojint'), 1, Infinity)),
					default: 1
				}
			]
		});
	}

	async exec(message, { playlist, position }) {
		if (playlist.user !== message.author.id) {
			return message.util.reply('you can only remove songs from your own playlists.');
		}
		position = position >= 1 ? position - 1 : playlist.tracks.length - (~position + 1);
		const decoded = await this.client.music.decode([playlist.tracks[position]]);
		playlist.tracks.splice(position, 1);
		await this.client.playlist.removesong(playlist.name, playlist.tracks);
		return message.util.send({
			embed: {
				color: 11642864,
				description: `Removed **${decoded[0].info.title}** from **${playlist.name}**`
			}
		});
	}
};
