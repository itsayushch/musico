const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
class ServerCommand extends Command {
	constructor() {
		super('server', {
			aliases: ['server', 'serverinfo', 'serverstats', 'serverstat'],
			category: 'info',
			channel: 'guild',
			clientPermissions: ['SEND_MESSAGES'],
			description: {
				content: 'Get Server Info',
				examples: ['']
			}
		});
	}

	exec(message) {
		const embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle('Server Info')
			.setThumbnail(message.guild.iconURL())
			.setAuthor(`${message.author.tag}`)
			.setDescription('Info On Your Server')
			.addField('❯ Name', message.guild.name, false)
			.addField('❯ Guild ID', message.guild.id, false)
			.addField('❯ Guild Creation', moment.utc(message.guild.createdAt).format('MM/DD/YYYY h:mm A'), false)
			.addField('❯ Members', message.guild.memberCount, false)
			.addField('❯ Explicit Filter', message.guild.explicitContentFilter, false)
			.addField('❯ Verification Level', message.guild.verificationLevel, false)
			.addField('❯ Channels', message.guild.channels.cache.filter(channel => channel.type !== 'category').size, false)
			.addField('❯ Server Owner', message.guild.owner, false)
			.addField('❯ Server Region', message.guild.region.toUpperCase(), false)
			.addField('❯ Join Date', moment(message.member.joinedAt).format('DD-MM-YYYY'), false)
			.setTimestamp();

		return message.util.send({ embed });
	}
}

module.exports = ServerCommand;
