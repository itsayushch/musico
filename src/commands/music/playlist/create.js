const { Command } = require('discord-akairo');

module.exports = class PlaylistCreateCommand extends Command {
	constructor() {
		super('playlist-create', {
			description: {
				content: 'Creates a playlist.',
				usage: '<playlist> [info]'
			},
			channel: 'guild',
			ratelimit: 2,
			args: [
				{
					id: 'playlist',
					type: 'existingPlaylist',
					prompt: {
						start: message => `${message.author}, What playlist do you want to create?`,
						retry: (message, { failure }) => `${message.author}, a playlist with the name **${failure.value}** already exists.`
					}
				},
				{
					id: 'info',
					match: 'rest',
					type: 'string'
				}
			]
		});
	}

	async exec(message, { playlist, info }) {
		const name = playlist;
		await this.client.playlist.create(message, name, info);

		return message.util.send({
			embed: {
				color: 11642864,
				description: `Successfully created **${name}**.`
			}
		});
	}
};
