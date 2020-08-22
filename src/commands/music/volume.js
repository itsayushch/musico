const { Command, Argument } = require('discord-akairo');

class VolumeCommand extends Command {
	constructor() {
		super('setvolume', {
			aliases: ['volume', 'set-vol', 'vol'],
			category: 'music',
			cooldown: 60000,
			channel: 'guild',
			args: [
				{
					id: 'volume',
					type: Argument.range('integer', 0, 100, true),
					default: 100
				}
			],
			description: {
				content: 'Sets volume of the music player (deafult 100)',
				usage: '<number>',
				examples: ['50', '60', '70']
			}
		});
	}

	cooldown() {
		return 1;
	}

	async exec(message, { volume }) {
		if (!message.member.voice || !message.member.voice.channel) {
			return message.util.send({
				embed: { description: 'You must be connected to a voice channel to use that command!', color: 0x5e17eb }
			});
		}

		const queue = this.client.music.queues.get(message.guild.id);
		await queue.player.setVolume(volume);
		await this.client.volume.set(message.guild.id, volume);
		const { left, right } = this.progress(volume);
		const embed = this.client.util.embed()
			.setAuthor('Player Volume')
			.setColor(0x5e17eb)
			.setDescription(`[${left.join('')}](${message.url.replace(message.id, '')})${right.join('')} \`${volume}\``);
		return message.util.send({ embed });
	}

	progress(num) {
		return {
			left: Array(Math.floor(num / 10)).fill('▬'),
			right: Array(10 - Math.floor(num / 10)).fill('▬')
		};
	}
}

module.exports = VolumeCommand;
