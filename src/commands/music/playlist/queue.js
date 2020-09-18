const { Argument, Command } = require('discord-akairo');
// const timeString = require('../../../util/timeString');
const paginate = require('../../../util/paginate');
module.exports = class PlaylistAddCommand extends Command {
	constructor() {
		super('playlist-queue', {
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
		const tracks = await queue.tracks();
		let embed;

		if (!current) {
			embed = {
				color: 'RED',
				description: 'Could not find anything in the queue!'

			};
		} else if (current || tracks) {
			const song = [];
			song.push(current.track);
			if (tracks) song.push(...tracks);

			const decoded = await this.client.music.decode(tracks);
			const songs = decoded.length;

			await this.client.playlist.add(message, playlist.name, song);

			embed = {
				author: {
					name: `Added to ${playlist.name.replace(/\b(\w)/g, char => char.toUpperCase())}`
				},
				color: 11642864,
				thumbnail: {
					url: `https://i.ytimg.com/vi/${decoded[0].identifier}/hqdefault.jpg`
				},
				description: `[${decoded[0].info.title}](${decoded[0].info.uri}) **+ ${songs} Song(s)**`

			};
		}

		return message.util.send({ embed });
	}
};
