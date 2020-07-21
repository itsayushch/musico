const { Command } = require('discord-akairo');
const ms = require('ms');
const ProgressBar = require('../../util/bar');
const timeString = require('../../util/timeString');
const moment = require('moment');

class ReplayCommand extends Command {
	constructor() {
		super('seek', {
			aliases: ['seek'],
			category: 'music',
			channel: 'guild',
			clientPermissions: ['USE_EXTERNAL_EMOJIS'],
			description: {
				content: 'Seeks to a certain point in the current track',
				examples: ['1:2']
			},
			args: [
				{
					id: 'position',
					type: 'string',
					default: '0'
				}
			]
		});
	}

	async exec(message, { position }) {
		const TIMESTAMP_REGEX = /^(\d+):(\d+)(?::(\d+))?$/;
		if (!message.member.voice || !message.member.voice.channel) {
			return message.util.send({
				embed: { description: 'You must be connected to a voice channel to use that command!', color: 'RED' }
			});
		}
		const queue = this.client.music.queues.get(message.guild.id);
		const current = await queue.current();
		if (!current) return;

		const point = ms(`${position.replace(/:/, '.')}m`);
		await queue.player.seek(point);
		const decoded = await this.client.music.decode(current.track);
		const duration = Number(decoded.length);
		const progress = new ProgressBar(point, duration, 15);
		const embed = this.client.util.embed()
			.setColor(0x5e17eb)
			.setAuthor('Seeked')
			.setThumbnail(`https://i.ytimg.com/vi/${decoded.identifier}/hqdefault.jpg`)
			.setDescription([
				`[${decoded.title}](${decoded.uri}) \`[${timeString(point)}/${decoded.isStream ? '∞' : timeString(decoded.length)}]\``,
				'\n',
				`${progress.createBar(message)}`
			]);
		return message.util.send({ embed });
	}
}
module.exports = ReplayCommand;
