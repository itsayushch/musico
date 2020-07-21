const { Argument, Command } = require('discord-akairo');
const timeString = require('../../util/timeString');

class RemoveCommand extends Command {
	constructor() {
		super('remove', {
			aliases: ['remove', 'rm'],
			clientPermissions: ['USE_EXTERNAL_EMOJIS'],
			description: {
				content: 'Removes a song from the queue.',
				usage: '[num]',
				examples: ['3', '6']
			},
			category: 'music',
			channel: 'guild',
			args: [
				{
					id: 'num',
					match: 'content',
					type: Argument.compose((message, str) => str.replace(/\s/g, ''), Argument.union('number', 'emojint'))
				}
			]
		});
	}

	async exec(message, { num }) {
		if (!message.member.voice || !message.member.voice.channel) {
			return message.util.send({
				embed: { description: 'You must be connected to a voice channel to use that command!', color: 'RED' }
			});
		}
		const queue = this.client.music.queues.get(message.guild.id);
		const tracks = await queue.tracks();
		if (!num || !tracks.length || num > tracks.length || num < -tracks.length) {
			return message.util.send({
				embed: { description: 'No track found for that number!', color: 'RED' }
			});
		}

		num = num >= 1 ? num - 1 : tracks.length - (~num + 1);
		const decoded = await this.client.music.decode([tracks[num]]);
		queue.remove(tracks[num]);
		const embed = {
			author: {
				name: 'Removed'
			},
			color: 0x5e17eb,
			description: `[${decoded[0].info.title}](${decoded[0].info.uri}) (${decoded[0].info.isStream ? 'Live' : timeString(decoded[0].info.length)})`,
			thumbnail: {
				url: `https://i.ytimg.com/vi/${decoded[0].info.identifier}/hqdefault.jpg`
			}
		};

		return message.util.send({ embed });
	}
}

module.exports = RemoveCommand;
