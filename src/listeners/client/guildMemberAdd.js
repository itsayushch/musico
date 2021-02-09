const { Listener } = require('discord-akairo');
const { MessageEmbed, GuildMember } = require('discord.js');

class GuildMemberAddListener extends Listener {
	constructor() {
		super('guildMemberAddMemberLog', {
			emitter: 'client',
			event: 'guildMemberAdd',
			category: 'client'
		});
	}

	async exec(member) {
		if (member.guild.id === '694554848758202451') await this.handleVerifiedBots(member);
		const memberlog = this.client.settings.get(member.guild.id, 'member-log', undefined);
		if (memberlog) {
			const embed = new MessageEmbed()
				.setColor(0x00FF00)
				.setThumbnail(member.user.displayAvatarURL())
				.setDescription(`Welcome **${member.user.username}**\nHope you have a wonderful time here.`)
				.setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL())
				.setFooter('User Joined')
				.setTimestamp();

			return this.client.channels.cache.get(memberlog).send(embed);
		}
	}

	/**
	 *
	 * @param {GuildMember} member - The guild member
	 */
	async handleVerifiedBots(member) {
		const { approved } = await this.client.mongo.db('musico').collection('bots').updateOne({ clientID: member.id });

		if (approved) {
			return member.roles.add('808307235590766602');
		}
	}
}

module.exports = GuildMemberAddListener;
