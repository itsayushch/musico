/* eslint-disable consistent-return */
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
		if (message.partial) return;
		if (message.author.bot) return;
		if (!message.content) return;
		if (message.guild.id === '694554848758202451') {
			const attachment = message.attachments.first();
			const embed = new MessageEmbed().setColor(0x824aee)
				.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
				.setDescription('**Message Deleted**')
				.addField('❯ Channel', `${message.channel} - ${message.channel.id}`)
				.setThumbnail('https://i.imgur.com/D6jek0j.png')
				.addField('❯ Message', `${message.content.substring(0, 1020)}`)
				.addField('❯ Message ID', `${message.id}`);
			if (attachment) embed.addField('❯ Attachment(s)', attachment.url);
			embed.setTimestamp(new Date());
			embed.setFooter('Message Deleted');
			this.client.channels.cache.get('695196728344838204').send({ embed });
		} else if (message.guild.id === '694902189033783306') {
			const attachment = message.attachments.first();
			const embed = new MessageEmbed().setColor(0x824aee)
				.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
				.setDescription('**Message Deleted**')
				.addField('❯ Channel', `${message.channel} - ${message.channel.id}`)
				.setThumbnail('https://i.imgur.com/D6jek0j.png')
				.addField('❯ Message', `${message.content.substring(0, 1020)}`)
				.addField('❯ Message ID', `${message.id}`);
			if (attachment) embed.addField('❯ Attachment(s)', attachment.url);
			embed.setTimestamp(new Date());
			embed.setFooter('Message Deleted');
			this.client.channels.cache.get('725340879291809843').send({ embed });
		}
	}
}

module.exports = MessageDeleteListener;
