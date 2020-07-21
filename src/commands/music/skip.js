const { Argument, Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const timeString = require('../../util/timeString');

class SkipCommand extends Command {
	constructor() {
		super('skip', {
			aliases: ['skip', 's', 'next'],
			clientPermissions: ['USE_EXTERNAL_EMOJIS'],
			description: {
				content: 'Skips the amount of songs you specify (defaults to 1)',
				usage: '<num>',
				examples: ['3', '1']
			},
			category: 'music',
			channel: 'guild'
		});
	}

	*args() {
		const num = yield {
			match: 'rest',
			type: Argument.compose((message, str) => str.replace(/\s/g, ''), Argument.range(Argument.union('number', 'emojint'), 1, Infinity)),
			default: 1
		};

		return { num };
	}

	async exec(message, { num }) {
		if (!message.member.voice || !message.member.voice.channel) {
			return message.util.send({
				embed: { description: 'You must be connected to a voice channel to use that command!', color: 'RED' }
			});
		}
		const queue = this.client.music.queues.get(message.guild.id);
		const queues = await queue.tracks();

		num = !queues.length || num > queues.length ? 1 : num;
		const skip = await queue.next(num);
		if (!skip) {
			await queue.stop();
			return message.util.send({
				embed: { author: { name: 'Skipped ⏭' }, color: 0x5e17eb }
			});
		}

		const song = await this.decode(queues[num - 1]);

		const embed = new MessageEmbed()
		    .setColor(0x5e17eb)
			.setAuthor('Now Playing')
			.setThumbnail(`https://i.ytimg.com/vi/${song.identifier}/hqdefault.jpg`)
			.setDescription([
				`[${song.title}](${song.uri}) (${song.isStream ? '∞' : timeString(song.length)})`
			]);

		return message.util.send({ embed });
	}

	async decode(track) {
		const decoded = await this.client.music.decode(track);
		return decoded;
	}
}

module.exports = SkipCommand;
