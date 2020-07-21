const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
class GuildMemberRemoveListener extends Listener {
	constructor() {
		super('guildMemberRemoveMemberLog', {
			emitter: 'client',
			event: 'guildMemberRemove',
			category: 'client'
		});
	}

	async exec(member) {
		const memberlog = this.client.settings.get(member.guild.id, 'member-log', undefined);
		if (memberlog) {
			const embed = new MessageEmbed()
				.setColor('RED')
				.setThumbnail(member.user.displayAvatarURL())
				.setDescription(`**${member.user.username}** left **${member.guild.name}**\nHope To See You Again `)
				.setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL())
				.setFooter('User joined')
				.setTimestamp();

			return this.client.channels.cache.get(memberlog).send(embed);
		}
	}
}

module.exports = GuildMemberRemoveListener;
