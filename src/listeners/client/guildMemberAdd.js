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
		const memberlog = this.client.settings.get(member.guild.id, 'member-log', undefined);
		if (memberlog) {
			const embed = new MessageEmbed()
				.setColor(0x00FF00)
				.setThumbnail(member.user.displayAvatarURL())
				.setDescription(`Welcome **${member.user.username}**\nHope you have a wonderful time here.`)
				.setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL())
				.setFooter('User Joined')
				.setTimestamp();

			this.client.channels.cache.get(memberlog).send(embed);
			setTimeout(async () => {
				if (member.guild.id === '694554848758202451') await this.handleVerifiedBots(member);
			}, 1000 * 2);
		}
	}

	/**
	 *
	 * @param {GuildMember} member - The guild member
	 */
	async handleVerifiedBots(member) {
		const { approved } = await this.client.mongo.db('musico').collection('bots').findOne({ clientID: member.id });

		if (approved) {
			if (member.roles.cache.has('694597110590341221')) await member.roles.remove('694597110590341221');
			return member.roles.add('808307235590766602');
		}
	}
}

module.exports = GuildMemberAddListener;
