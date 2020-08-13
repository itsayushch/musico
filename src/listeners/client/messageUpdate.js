const { Listener } = require('discord-akairo');
const { MessageEmbed, Util } = require('discord.js');
const diff = require('diff');

class MessageUpdateListener extends Listener {
	constructor() {
		super('messageUpdate', {
			emitter: 'client',
			event: 'messageUpdate',
			category: 'client'
		});
	}

	exec(oldMessage, newMessage) {
		if (oldMessage.author.bot || newMessage.author.bot) return;
		if (Util.escapeMarkdown(oldMessage.content) === Util.escapeMarkdown(newMessage.content)) return;

		const logChannel = this.client.settings.get(newMessage.guild.id, 'message-log', undefined);
		const embed = new MessageEmbed()
			.setColor(0x5e17eb)
			.setAuthor(`${newMessage.author.tag} (${newMessage.author.id})`, newMessage.author.displayAvatarURL())
			.setTitle('Message Deleted')
			.setDescription([
				'❯ Old Message',
				`${oldMessage.content.substring(0, 1000)}`,
				'',
				'❯ New Message',
				`[${newMessage.content.substring(0, 1000)}](${newMessage.url})`
			])
			.addField('❯ Channel', `${newMessage.channel} (${newMessage.channel.id})`)
			.setThumbnail('https://i.imgur.com/D6jek0j.png')
			.addField('❯ Message ID', `${newMessage.id}`);
		embed.setTimestamp();
		embed.setFooter('Message Deleted');
		if (logChannel) {
			const sendguild = newMessage.guild;
			sendguild.channels.cache.get(logChannel).send({ embed });
		}
	}
}

module.exports = MessageUpdateListener;
