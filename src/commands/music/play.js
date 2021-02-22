const { Argument, Command } = require('discord-akairo');
const path = require('path');
const url = require('url');
const timeString = require('../../util/timeString');
const { stripIndents } = require('common-tags');

class PlayCommand extends Command {
	constructor() {
		super('play', {
			aliases: ['play', 'p', 'add'],
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: [
					'Play a song from literally any source you can think of.',
					'`--next` - adds a song to the top of the queue.',
					'`--start` - adds a song to the top of the queue then skips to it.'
				],
				usage: '<link/search> [--start/-s/--next/-n]',
				examples: ['back to beautiful', 'into you --start']
			},
			category: 'music',
			channel: 'guild',
			args: [
				{
					id: 'next',
					match: 'flag',
					flag: ['--next', '-n']
				},
				{
					id: 'start',
					match: 'flag',
					flag: ['--start', '-s']
				},
				{
					id: 'query',
					match: 'rest',
					type: Argument.compose('string', (msg, str) => str ? str.replace(/<(.+)>/g, '$1') : ''),
					default: ''
				}
			]
		});
	}

	async exec(message, { query, next, start }) {
		if (!message.member.voice || !message.member.voice.channel) {
			return message.util.send({
				embed: { description: 'You must be connected to a voice channel to use that command!', color: 'RED' }
			});
		} else if (!message.member.voice.channel.joinable) {
			return message.util.send({
				embed: { description: 'I don\'t have permission to **connect** to this voice channel!', color: 'RED' }
			});
		} else if (!message.member.voice.channel.speakable) {
			return message.util.send({
				embed: { description: 'I don\'t have permission to **speak** in this voice channel!', color: 'RED' }
			});
		}

		if (!query && message.attachments.first()) {
			query = message.attachments.first().url;
			if (!['.mp3', '.ogg', '.flac', '.m4a'].includes(path.parse(url.parse(query).path).ext)) return;
		} else if (!query) {
			return;
		}
		if (!['http:', 'https:'].includes(url.parse(query).protocol)) query = `ytsearch:${query}`;

		const queue = this.client.music.queues.get(message.guild.id);
		const res = await queue.load(query);

		if (!message.guild.me.voice.channel) await queue.player.join(message.member.voice.channel.id);

		let embed;
		if (['TRACK_LOADED', 'SEARCH_RESULT'].includes(res.loadType)) {
			if (next || start) await queue.unshift(res.tracks[0].track);
			if (start && await queue.current()) await queue.next(1);
			else await queue.add(res.tracks[0].track);
			embed = {
				author: {
					name: 'Added to queue'
				},
				color: 11642864,
				description: stripIndents`
				**❯ Song**
				[${res.tracks[0].info.title}](${res.tracks[0].info.uri})

				**❯ Uploaded By**
				${res.tracks[0].info.author}

				**❯ Length**
				${res.tracks[0].info.isStream ? 'Live' : timeString(res.tracks[0].info.length)}
				`,
				thumbnail: {
					url: `https://i.ytimg.com/vi/${res.tracks[0].info.identifier}/hqdefault.jpg`
				}
			};
		} else if (res.loadType === 'PLAYLIST_LOADED') {
			await queue.add(...res.tracks.map(track => track.track));
			const totalLength = res.tracks.filter(track => !track.info.isStream).reduce((prev, song) => prev + song.info.length, 0);
			embed = {
				author: {
					name: 'Added to queue'
				},
				color: 11642864,
				description: stripIndents`
				**❯ Playlist**
				${res.playlistInfo.name}

				**❯ Total Songs**
				${res.tracks.length}

				**❯ Total Length**
				${timeString(totalLength)}
				`,
				thumbnail: {
					url: `https://i.ytimg.com/vi/${res.tracks[0].info.identifier}/hqdefault.jpg`
				}
			};
		} else if (res.loadType === 'LOAD_FAILED') {
			embed = {
				color: 'RED',
				description: `**${res.exception.message}**`,
				thumbnail: {
					url: this.client.user.avatarURL()
				}
			};
		} else if (res.loadType === 'NO_MATCHES') {
			return message.util.send({
				embed: {
					color: 'RED',
					description: 'No results found!'
				}
			});
		} else {
			return message.util.send({
				embed: {
					description: 'No results found!',
					color: 'RED'
				}
			});
		}

		if (queue.player.playing === false && queue.player.paused === false) await queue.start();

		return message.util.send({ embed });
	}
}

module.exports = PlayCommand;
