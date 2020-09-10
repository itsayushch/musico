const { Command, Argument } = require('discord-akairo');
const path = require('path');
const url = require('url');
module.exports = class extends Command {
	constructor() {
		super('youtube', {
			aliases: ['youtube', 'yt'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			channel: 'guild',
			args: [
				{
					id: 'query',
					match: 'rest',
					type: Argument.compose('string', (msg, str) => str ? str.replace(/<(.+)>/g, '$1') : ''),
					prompt: {
						start: 'Which video do you want to search?'
					}
				}
			],
			description: {
				content: 'Search Youtube videos from your \`query\`',
				usage: '<query>',
				examples: ['WWE', 'Song']
			}
		});
	}

	async exec(message, { query }) {
		if (!query && message.attachments.first()) {
			query = message.attachments.first().url;
			if (!['.mp3', '.ogg', '.flac', '.m4a'].includes(path.parse(url.parse(query).path).ext)) return;
		} else if (!query) {
			return;
		}
		if (!['http:', 'https:'].includes(url.parse(query).protocol)) query = `ytsearch:${query}`;

		const res = await this.client.music.load(query);
		if (res.loadType === 'NO_MATCHES') {
			return message.util.send({
				embed: { description: 'I couldn\'t find What you were looking for!', color: 'RED' }
			});
		}
		return message.channel.send(res.tracks[0].info.uri);
	}
};
