const { Command } = require('discord-akairo');

module.exports = class extends Command {
	constructor() {
		super('youtube', {
			aliases: ['youtube', 'yt'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			channel: 'guild',
			args: [
				{
					id: 'youtube',
					type: 'string',
					match: 'rest'
				}
			],
			description: {
				content: 'Search Youtube videos from your \`query\`',
				usage: '<query>',
				examples: ['WWE', 'Song']
			}
		});
	}

	async exec(message, args) {
		const track = await this.client.music.load(`ytsearch:${args.youtube}`).then(d => d.tracks);
		if (!track.length) {
			return message.util.send({
				embed: { description: 'I couldn\'t find What you were looking for!', color: 'RED' }
			});
		}
		return message.channel.send(track.tracks[0].info.uri);
	}
};
