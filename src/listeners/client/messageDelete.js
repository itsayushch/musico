const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class MessageDeleteListener extends Listener {
	constructor() {
		super('messageDelete', {
			emitter: 'client',
			event: 'messageDelete',
			category: 'client'
		});
	}

	exec(message) {
		if (message.partial || message.author.bot || !message.content) return;
		const logChannel = this.client.settings.get(message.guild.id, 'message-log', undefined);

		const attachment = message.attachments.first();
		const embed = new MessageEmbed()
			.setColor(0x824aee)
			.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
			.setTitle('Message Deleted')
			.setDescription([
				'❯ Message',
				`${message.content.substring(0, 2000)}`
			])
			.addField('❯ Channel', `${message.channel} (${message.channel.id})`)
			.setThumbnail('https://i.imgur.com/D6jek0j.png')
			.addField('❯ Message ID', `${message.id}`);
		if (attachment) embed.addField('❯ Attachment(s)', attachment.url);
		embed.setTimestamp();
		embed.setFooter('Message Deleted');
		if (logChannel) {
			const sendguild = message.guild;
			sendguild.channels.cache.get(logChannel).send({ embed });
		}
	}
}

module.exports = MessageDeleteListener;
