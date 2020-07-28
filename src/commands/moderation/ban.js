/* eslint-disable no-else-return */
const { Command } = require('discord-akairo');
const moment = require('moment');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {
	constructor() {
		super('ban', {
			aliases: ['ban'],
			channel: 'guild',
			clientPermissions: ['BAN_MEMBERS'],
			userPermissions: ['BAN_MEMBERS'],
			category: 'moderation',
			description: {
				content: 'Kicks a member',
				usage: '[@user] <reason>]',
				example: ['@Ayush']
			},
			args: [
				{
					id: 'toKick',
					type: 'member',
					prompt: {
						start: 'Which member do you want to ban?',
						retry: 'Please enter a valid member!'
					}
				},
				{
					id: 'reason',
					type: 'string',
					default: '\`Not specified\`',
					match: 'rest'
				}
			]
		});
	}

	async exec(message, { reason, toKick }) {
		const logChannel = this.client.settings.get(message.guild.id, 'mod-log');
		// No member found
		if (toKick.id === message.author.id) {
			return message.util.send({ embed: { description: 'You can\'t ban yourself' } });
		} else if (toKick.id === this.client.user.id) {
			return message.util.send({ embed: { description: 'I can\'t ban myself' } });
		} else if (!toKick.kickable) {
			return message.util.send({ embed: { description: `I can\'t ban **${toKick.user.tag}** due to role hierarchy!` } });
		} else {
			await toKick.ban();
			const embed = this.client.util.embed()
				.setColor(0xFF0000)
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(stripIndents`
					**Action:** BAN
					**Member:** ${toKick.user.tag} (${toKick.user.id})
					**Reason:** ${reason}
				`)
				.setTimestamp();
			await message.util.send({
				embed: {
					description: `Succesfully banned ${toKick.user.tag}`
				}
			});
			if (logChannel) return this.client.channels.cache.get(logChannel).send(embed);
		}
	}
};
