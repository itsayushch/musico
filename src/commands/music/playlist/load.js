const { Command } = require('discord-akairo');
const timeString = require('../../../util/timeString');
module.exports = class PlaylistLoadCommand extends Command {
	constructor() {
		super('playlist-load', {
			description: {
				content: 'Loads a playlist into the queue.',
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
						start: message => `${message.author}, What playlist should be played?`,
						retry: (message, { failure }) => `${message.author}, a playlist with the name **${failure.value}** does not exist.`
					}
				}
			]
		});
	}

	async exec(message, { playlist }) {
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
		const queue = this.client.music.queues.get(message.guild.id);
		if (!message.guild.me.voice.channel) await queue.player.join(message.member.voice.channel.id);
		const decoded = await this.client.music.decode(playlist.tracks[0]);
		await queue.add(...playlist.tracks);
		const embed = this.client.util.embed().setColor(11642864)
			.setAuthor('Added to queue')
			.setThumbnail(`https://i.ytimg.com/vi/${decoded.identifier}/hqdefault.jpg`)
			.setDescription([
				`[${decoded.title}](${decoded.uri})`
			]);
		if (queue.player.playing === false && queue.player.paused === false) await queue.start();
		playlist.plays += 1;
		await this.client.playlist.plays(playlist.name, playlist.plays);

		return message.util.send(embed);
	}
};
