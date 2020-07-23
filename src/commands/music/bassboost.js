const { Command } = require('discord-akairo');

const bass = {
	off: 0,
	soft: 1,
	weak: 2,
	medium: 3,
	bass_4: 4,
	strong: 5,
	bass_6: 6,
	insane: 7,
	bass_8: 8,
	bass_9: 9,
	wtf: 10
};

class BassBoosterCommand extends Command {
	constructor() {
		super('bassboost', {
			aliases: ['bassboost', 'bass', 'boost', 'bb'],
			ratelimit: 2,
			category: 'music',
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: [
					'Sets the BassBoost',
					'**Keys**',
					'• off',
					'• soft',
					'• weak',
					'• medium',
					'• strong',
					'• insane',
					'• wtf'
				],
				usage: '<mode>',
				examples: [
					'',
					'off',
					'medium',
					'strong',
					'wtf'
				]
			},
			args: [
				{
					id: 'mode',
					type: [
						['off', '0'],
						['soft', '1'],
						['weak', '2'],
						['medium', '3'],
						['bass_4', '4'],
						['strong', '5'],
						['bass_6', '6'],
						['insane', '7'],
						['bass_8', '8'],
						['bass_9', '9'],
						['wtf', '10']
					],
					default: 'soft'
				}
			]
		});

		this.off = [{ band: 0, gain: 0 }, { band: 1, gain: 0 }, { band: 2, gain: 0 }, { band: 3, gain: 0 }, { band: 4, gain: 0 }, { band: 5, gain: 0 }];
		this.soft = [{ band: 0, gain: -0.05 }, { band: 1, gain: 0.07 }, { band: 2, gain: 0.16 }, { band: 3, gain: 0.03 }, { band: 4, gain: -0.05 }, { band: 5, gain: -0.11 }];
		this.weak = [{ band: 0, gain: 0.03 }, { band: 1, gain: 0.01 }, { band: 2, gain: 0.0 }];
		this.medium = [{ band: 0, gain: 0.1 }, { band: 1, gain: 0.08 }, { band: 2, gain: 0.04 }];
		this.bass_4 = [{ band: 0, gain: 0.1 }, { band: 1, gain: 0.09 }, { band: 2, gain: 0.05 }];
		this.strong = [{ band: 0, gain: 0.2 }, { band: 1, gain: 0.15 }, { band: 2, gain: 0.11 }];
		this.bass_6 = [{ band: 0, gain: 0.3 }, { band: 1, gain: 0.18 }, { band: 2, gain: 0.14 }];
		this.insane = [{ band: 0, gain: 0.4 }, { band: 1, gain: 0.26 }, { band: 2, gain: 0.18 }];
		this.bass_8 = [{ band: 0, gain: 0.5 }, { band: 1, gain: 0.28 }, { band: 2, gain: 0.20 }];
		this.bass_9 = [{ band: 0, gain: 0.4 }, { band: 1, gain: 0.26 }, { band: 2, gain: 0.18 }];
		this.wtf = [{ band: 0, gain: 1 }, { band: 1, gain: 0.8 }, { band: 2, gain: 0.6 }];
	}

	cooldown(message) {
		const premium = this.client.settings.get('global', 'premium', []);
		if (premium.includes(message.author.id)) return 10000;
		return 60000;
	}

	async exec(message, { mode }) {
		if (!message.member.voice || !message.member.voice.channel) {
			return message.util.send({
				embed: { description: 'You must be connected to a voice channel to use that command!', color: 0x5e17eb }
			});
		}

		const queue = this.client.music.queues.get(message.guild.id);

		const embed = this.client.util.embed()
			.setAuthor('Bass Boost')
			.setColor(0x5e17eb);

		if (mode === 'off') {
			await queue.player.setEqualizer(this.off);
		} else if (mode === 'soft') {
			await queue.player.setEqualizer(this.soft);
		} else if (mode === 'weak') {
			await queue.player.setEqualizer(this.weak);
		} else if (mode === 'medium') {
			await queue.player.setEqualizer(this.medium);
		} else if (mode === 'bass_4') {
			await queue.player.setEqualizer(this.bass_4);
		} else if (mode === 'strong') {
			await queue.player.setEqualizer(this.strong);
		} else if (mode === 'bass_6') {
			await queue.player.setEqualizer(this.bass_6);
		} else if (mode === 'insane') {
			await queue.player.setEqualizer(this.insane);
		} else if (mode === 'bass_8') {
			await queue.player.setEqualizer(this.bass_8);
		} else if (mode === 'bass_9') {
			await queue.player.setEqualizer(this.bass_9);
		} else if (mode === 'wtf') {
			await queue.player.setEqualizer(this.wtf);
		} else {
			await queue.player.setEqualizer(this.soft);
		}
		await this.client.bass.set(message.guild.id, bass[mode]);
		const { left, right } = this.progress(mode);
		embed.setDescription(`[${left.join('')}](${message.url.replace(message.id, '')})${right.join('')}`);
		return message.util.send({ embed });
	}

	progress(mode) {
		return {
			left: Array(bass[mode]).fill('▬'),
			right: Array(10 - bass[mode]).fill('▬')
		};
	}
}

module.exports = BassBoosterCommand;
