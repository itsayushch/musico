const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');
const ProgressBar = require('../../util/bar');
module.exports = class extends Command {
	constructor() {
		super('music-stats', {
			aliases: ['music', 'filters', 'music-filters'],
			description: {
				content: 'Shows the music filters'
			},
			category: 'music'
		});
	}

	async exec(message) {
		const queue = this.client.music.queues.get(message.guild.id);
		const currBase = this.client.bass.get(message.guild.id);
		const currVolume = this.client.volume.get(message.guild.id);
		const progress_bass = new ProgressBar(currBase ? currBase : 0, 10, 10);
		const progress_volume = new ProgressBar(currVolume ? currVolume : 100, 100, 10);
		const queue = this.client.music.queues.get(message.guild.id);

		const embed = this.client.util.embed()
			.setColor(0x5e17eb)
			.setAuthor('Musico', this.client.user.displayAvatarURL())
			.setTitle('**Music Filters**')
			.setDescription(stripIndents`
				**❯ Song Playing**
				${queue.player.playing === false ? '<:no:705748651418452030> No' : '<:yes:705748854703783989> Yes'}

				**❯ Song Paused**
				${queue.player.paused === false ? '<:no:705748651418452030> No' : '<:yes:705748854703783989> Yes'}

				**❯ Loop**
				${queue.looping() ? '<:yes:705748854703783989> Enabled' : '<:no:705748651418452030> Disabled'}


				**❯ Options**
				• Bass - ${currBase ? currBase : 0}
				${progress_bass.createBar(message)}

				• Volume - ${currVolume ? currVolume : 100}
				${progress_volume.createBar(message)}
			`);

		return message.util.send(embed);
	}
};
