/* eslint-disable no-else-return */
const { Command } = require('discord-akairo');
const moment = require('moment');
const { stripIndents } = require('common-tags');

module.exports = class KickCommand extends Command {
	constructor() {
		super('kick', {
			aliases: ['kick'],
			channel: 'guild',
			clientPermissions: ['KICK_MEMBERS'],
			userPermissions: ['KICK_MEMBERS'],
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
						start: 'Which member do you want to kick?',
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
			return message.util.send({ embed: { description: 'You can\'t kick yourself' } });
		} else if (toKick.id === this.client.user.id) {
			return message.util.send({ embed: { description: 'I can\'t kick myself' } });
		} else if (!toKick.kickable) {
			return message.util.send({ embed: { description: `I can\'t kick **${toKick.user.tag}** due to role hierarchy!` } });
		} else {
			await toKick.kick();
			const embed = this.client.util.embed()
				.setColor('RED')
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(stripIndents`
					**Action:** KICK
					**Member:** ${toKick.user.tag} (${toKick.user.id})
					**Reason:** ${reason}
				`)
				.setTimestamp();
			await message.util.send({
				embed: {
					description: `Succesfully kicked ${toKick.user.tag}`
				}
			});
			if (logChannel) return this.client.channels.cache.get(logChannel).send(embed);
		}
	}
};
