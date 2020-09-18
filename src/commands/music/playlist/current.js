const { Argument, Command } = require('discord-akairo');
const timeString = require('../../../util/timeString');
module.exports = class PlaylistAddCommand extends Command {
	constructor() {
		super('playlist-current', {
			channel: 'guild',
			ratelimit: 2,
			args: [
				{
					id: 'playlist',
					type: 'playlist',
					prompt: {
						start: 'What playlist should this song/playlist be added to?',
						retry: (msg, { phrase }) => `A playlist with the name \`${phrase}\` does not exist!`
					}
				}
			]
		});
	}

	async exec(message, { playlist }) {
		if (playlist.user !== message.author.id) {
			return message.util.send({
				embed: { description: 'You can only add songs your own playlists!', color: 3093046 }
			});
		}

		const queue = this.client.music.queues.get(message.guild.id);
		const current = await queue.current();
		let embed;

		if (!current) {
			embed = {
				color: 'RED',
				description: 'Could not find anything in the queue!'

			};
		} else if (current) {
			await this.client.playlist.add(message, playlist.name, [current.track]);
			const decoded = await this.client.music.decode(current.track);
			embed = {
				author: {
					name: `Added to ${playlist.name.replace(/\b(\w)/g, char => char.toUpperCase())}`
				},
				color: 11642864,
				thumbnail: {
					url: `https://i.ytimg.com/vi/${decoded.identifier}/hqdefault.jpg`
				},
				description: `[${decoded.title}](${decoded.uri}) (${timeString(current.position)}/${decoded.isStream ? '∞' : timeString(decoded.length)})`

			};
		}

		return message.util.send({ embed });
	}
};
