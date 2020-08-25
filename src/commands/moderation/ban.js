/* eslint-disable no-else-return */
const { Command } = require('discord-akairo');
const { CONSTANTS } = require('../../util/constants');

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
					id: 'member',
					type: 'member',
					prompt: {
						start: 'Which member do you want to ban?',
						retry: 'Please enter a valid member!'
					}
				},
				{
					id: 'reason',
					type: 'string',
					default: '',
					match: 'rest'
				}
			]
		});
	}

	async exec(message, { reason, member }) {
		const logChannel = this.client.settings.get(message.guild.id, 'mod-log');
		const totalCases = this.client.settings.get(message.guild.id, 'caseTotal', 0) + 1;

		if (member.id === message.author.id) {
			return message.util.send({ embed: { description: 'You can\'t ban yourself' } });
		} else if (member.id === this.client.user.id) {
			return message.util.send({ embed: { description: 'I can\'t ban myself' } });
		} else if (!member.kickable) {
			return message.util.send({ embed: { description: `I can\'t ban **${member.user.tag}** due to role hierarchy!` } });
		} else {
			await member.ban();
			await message.util.send({
				embed: {
					description: `Succesfully banned ${member.user.tag}`
				}
			});
			this.client.settings.set(message.guild.id, 'caseTotal', totalCases);

			if (!reason) {
				const prefix = this.handler.prefix(message);
				reason = `Use \`${prefix}reason ${totalCases} <...reason>\` to set a reason for this case`;
			}

			let modMessage;
			if (logChannel && this.client.channels.cache.has(logChannel)) {
				const embed = this.client.util.embed()
					.setColor(CONSTANTS.COLORS.BAN)
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setDescription(stripIndents`
					**Action:** BAN
					**Member:** ${member.user.tag} (${member.user.id})
					**Reason:** ${reason}
				`)
					.setTimestamp();
				modMessage = await this.client.channels.cache.get(logChannel).send(embed);
			}

			return this.client.case.create(
				message,
				member,
				totalCases,
				CONSTANTS.ACTIONS.BAN,
				modMessage,
				reason
			);
		}
	}
};
