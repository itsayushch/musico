const { Command, version: akairoVersion } = require('discord-akairo');
const { MessageEmbed, version: djsVersion } = require('discord.js');
const moment = require('moment');
const os = require('os');
require('moment-duration-format');
const { version } = require('../../../package.json');

class StatsCommand extends Command {
	constructor() {
		super('stats', {
			aliases: ['stats'],
			category: 'general',
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Displays statistics about the Bot.'
			},
			args: [
				{
					id: 'music',
					match: 'flag',
					flag: ['--music', '-m', 'music', 'm']
				}
			]
		});
	}

	async exec(message, { music }) {
		if (music) {
			const lavalink = await this.client.stats.get('lavalink-stats');
			const queue = this.client.music.queues.get(message.guild.id);
			const embed = this.client.util.embed()
				.setColor(0x5e17eb)
				.setAuthor('Musico', this.client.user.displayAvatarURL())
				.setTitle('**Music Stats**')
				.setFooter(`© ${new Date().getFullYear()} ${this.owner.username}#${this.owner.discriminator}`, this.owner.displayAvatarURL())
				.addField('Lavalink Uptime', `${moment.duration(lavalink.uptime).format('D [days], H [hrs], m [mins], s [secs]', { trim: 'both mid' })}`, true)
				.addField('Total Players', `${lavalink.players}`, true)
				.addField('Players Playing', `${lavalink.playingPlayers}`, true)
				.addField('Voice States', `${this.client.music.voiceStates.size}`, true)
				.addField('Voice Servers', `${this.client.music.voiceServers.size}`, true)
				.addField('Loop', `${queue.looping() ? '<:yes:705748854703783989> Enabled' : '<:no:705748651418452030> Disabled'}`, true);

			return message.util.send(embed);
		}
		const embed = new MessageEmbed()
			.setColor(0x5e17eb)
			.setAuthor('Musico', this.client.user.displayAvatarURL())
			.setTitle('**Stats**')
			.addField('**Memory Usage**', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB `, true)
			.addField('**Uptime**', `${moment.duration(process.uptime() * 1000).format('D [days], H [hrs], m [mins], s [secs]', { trim: 'both mid' })}`, true)
			.addField('**Guilds**', `${this.client.guilds.cache.size}`, true)
			.addField('**Channels**', `${this.client.channels.cache.size}`, true)
			.addField('**Users**', `${this.client.users.cache.size}`, true)
			.addField('**Free Memory**', `${this.freemem > 1024 ? `${(this.freemem / 1024).toFixed(2)} GB` : `${Math.round(this.freemem)} MB`}`, true)
			.addField('**Bot Version**', `v${version}`, true)
			.addField('**Discord.js**', `v${djsVersion}`, true)
			.addField('**Discord-akairo**', `v${akairoVersion}`, true)
			.setFooter(`© ${new Date().getFullYear()} ${this.owner.tag}`, this.owner.displayAvatarURL());

		const msg = await message.util.send({ embed });
		msg.react('🗑');
		let react;
		try {
			react = await msg.awaitReactions(
				(reaction, user) => reaction.emoji.name === '🗑' && user.id === message.author.id,
				{ max: 1, time: 30000, errors: ['time'] }
			);
		} catch (error) {
			await msg.reactions.removeAll().catch(() => null);
			return message;
		}
		react.first().message.delete();
		return message;
	}

	get freemem() {
		return os.freemem() / (1024 * 1024);
	}

	get owner() {
		return this.client.users.cache.get(this.client.ownerID[0]);
	}
}

module.exports = StatsCommand;
