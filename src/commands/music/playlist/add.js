const { Argument, Command } = require('discord-akairo');
const timeString = require('../../../util/timeString');
const path = require('path');
const url = require('url');
module.exports = class PlaylistAddCommand extends Command {
	constructor() {
		super('playlist-add', {
			description: {
				content: 'Adds a song to the playlist.',
				usage: '<playlist> <link/playlist>'
			},
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
				},
				{
					id: 'query',
					match: 'rest',
					type: Argument.compose('string', (msg, str) => str ? str.replace(/<(.+)>/g, '$1') : ''),
					prompt: {
						start: 'Which song do you want to add?',
						retry: (msg, { phrase }) => 'A playlist with the name does not exist!'
					}
				}
			]
		});
	}

	async exec(message, { playlist, query }) {
		if (playlist.user !== message.author.id) {
			return message.util.send({
				embed: { description: 'You can only add songs your own playlists!', color: 3093046 }
			});
		}

		if (!query && message.attachments.first()) {
			query = message.attachments.first().url;
			if (!['.mp3', '.ogg', '.flac', '.m4a'].includes(path.parse(url.parse(query).path).ext)) return;
		} else if (!query) {
			return;
		}
		if (!['http:', 'https:'].includes(url.parse(query).protocol)) query = `ytsearch:${query}`;

		const res = await this.client.music.load(query);
		let embed;
		if (['TRACK_LOADED', 'SEARCH_RESULT'].includes(res.loadType)) {
			await this.client.playlist.add(message, playlist.name, [res.tracks[0].track]);

			embed = {
				author: {
					name: `Added to ${playlist.name.replace(/\b(\w)/g, char => char.toUpperCase())}`
				},
				color: 11642864,
				thumbnail: {
					url: `https://i.ytimg.com/vi/${res.tracks[0].info.identifier}/hqdefault.jpg`
				},
				description: `[${res.tracks[0].info.title}](${res.tracks[0].info.uri}) (${res.tracks[0].info.isStream ? 'Live' : timeString(res.tracks[0].info.length)})`
			};
		} else if (res.loadType === 'PLAYLIST_LOADED') {
			await this.client.playlist.add(message, playlist.name, res.tracks.map(track => track.track));
			embed = {
				author: {
					name: `Added to ${playlist.name.replace(/\b(\w)/g, char => char.toUpperCase())}`
				},
				color: 11642864,
				description: res.playlistInfo.name,
				thumbnail: {
					url: `https://i.ytimg.com/vi/${res.tracks[0].info.identifier}/hqdefault.jpg`
				}
			};
		} else if (res.loadType === 'LOAD_FAILED') {
			embed = {
				color: 'RED',
				description: res.exception.message
			};
		} else {
			return message.util.send({ embed: { description: 'I couldn\'t find What you were looking for!', color: 'RED' } });
		}

		return message.util.send({ embed });
	}
};
