const { Command } = require('discord-akairo');
const timeString = require('../../util/timeString');

class ReplayCommand extends Command {
	constructor() {
		super('replay', {
			aliases: ['replay'],
			category: 'music',
			channel: 'guild',
			clientPermissions: ['USE_EXTERNAL_EMOJIS'],
			description: {
				content: 'Reset the progress of the current song.',
				examples: ['']
			}
		});
	}

	async exec(message) {
		if (!message.member.voice || !message.member.voice.channel) {
			return message.util.send({
				embed: { description: 'You must be connected to a voice channel to use that command!', color: 'RED' }
			});
		}
		const queue = this.client.music.queues.get(message.guild.id);
		const current = await queue.current();
		if (!current) return;
		await queue.player.seek(0);
		const decoded = await this.client.music.decode(current.track);
		const embed = this.client.util.embed()
			.setColor(11642864)
			.setAuthor('Replaying')
			.setThumbnail(`https://i.ytimg.com/vi/${decoded.identifier}/hqdefault.jpg`)
			.setDescription([
				`[${decoded.title}](${decoded.uri}) (${decoded.isStream ? 'Live' : timeString(decoded.length)})`
			]);
		return message.util.send({ embed });
	}
}

module.exports = ReplayCommand;
