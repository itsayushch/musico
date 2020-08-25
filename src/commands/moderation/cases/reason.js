const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class ReasonCommand extends Command {
	constructor() {
		super('reason', {
			aliases: ['reason'],
			category: 'mod',
			channel: 'guild',
			ratelimit: 2,
			args: [
				{
					id: 'caseNum',
					type: 'number',
					prompt: {
						start: 'What case do you want to add a reason to?',
						retry: 'Please enter a valid case number.'
					}
				},
				{
					id: 'reason',
					match: 'rest',
					type: 'string'
				}
			],
			description: {
				content: 'Sets/Updates the reason of a modlog entry.',
				usage: '<case> <...reason>',
				examples: ['1234 dumb', 'latest dumb']
			},
			userPermissions: ['MANAGE_GUILD']
		});
	}

	async exec(message, { caseNum, reason }) {
		const cases = await this.client.mongo.db('musico').collection('cases').findOne({ caseID: caseNum, guildID: message.guild.id });
		if (!cases) {
			return message.reply('I looked where I could, but I couldn\'t find a case with that Id, maybe look for something that actually exists!');
		}
		if (cases.authorID && (cases.authorID !== message.author.id && !message.member.permissions.has('MANAGE_GUILD'))) {
			return message.reply('You\'d be wrong in thinking I would let you fiddle with other peoples achievements!');
		}

		const modLogChannel = this.client.settings.get(message.guild.id, 'mod-log', undefined);

		if (modLogChannel && this.client.channels.cache.has(modLogChannel)) {
			const caseEmbed = await this.client.channels.cache.get(modLogChannel).messages.fetch(cases.messageID);
			if (!caseEmbed) return message.reply('Looks like the message doesn\'t exist anymore!');
			const embed = new MessageEmbed(caseEmbed.embeds[0]);
			embed.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
				.setDescription(caseEmbed.embeds[0].description.replace(/\*\*Reason:\*\* [\s\S]+/, `**Reason:** ${reason}`));
			await caseEmbed.edit(embed);
		}

		if (cases) {
			await this.client.case.update(message, caseNum, reason);
		}

		return message.util.send(`Successfully set reason for case **#${caseNum}**`);
	}
}

module.exports = ReasonCommand;
