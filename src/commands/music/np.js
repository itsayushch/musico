const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const timeString = require('../../util/timeString');
const ProgressBar = require('../../util/bar');
const { stripIndents } = require('common-tags');

class NPCommand extends Command {
	constructor() {
		super('now-playing', {
			aliases: ['np', 'now-playing'],
			clientPermissions: ['USE_EXTERNAL_EMOJIS'],
			description: {
				content: 'Shows What song the bot is currently playing.',
				examples: ['']
			},
			category: 'music',
			channel: 'guild'
		});
	}

	async exec(message) {
		const queue = this.client.music.queues.get(message.guild.id);
		const current = await queue.current();
		if (!current) {
			const embed = new MessageEmbed()
				.setColor('RED')
				.setDescription('Could not find anything in the queue!');
			return message.util.send({ embed });
		}
		const decoded = await this.client.music.decode(current.track);
		const position = Number(current.position);
		const duration = Number(decoded.length);
		const progress = new ProgressBar(position, duration, 15);

		const currBase = this.client.bass.get(message.guild.id);
		const currVolume = this.client.volume.get(message.guild.id);

		const embed = new MessageEmbed()
			.setColor(0x5e17eb)
			.setAuthor('Now Playing')
			.setThumbnail(`https://i.ytimg.com/vi/${decoded.identifier}/hqdefault.jpg`)
			.setDescription(stripIndents`
			**❯ Song**
			[${decoded.title}](${decoded.uri})

			**❯ Uploaded by**
			${decoded.author}

			**❯ Time**
			${timeString(current.position)}/${decoded.isStream ? '∞' : timeString(decoded.length)}

			**❯ Progress Bar**
			${progress.createBar(message)}

			**❯ Options**
			\u2002• Bass - \`${currBase ? currBase : 0}\`
			\u2002• Volume - \`${currVolume ? currVolume : 100}\`
			\u2002• Loop - \`${queue.looping() ? 'Enabled' : 'Disabled'}\`
			`);
		return message.util.send({ embed });
	}
}

module.exports = NPCommand;
