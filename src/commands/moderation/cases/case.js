const { Command, Argument } = require('discord-akairo');
const { CONSTANTS } = require('../../../util/constants');
const ms = require('ms');
const ACTIONS = {
	1: 'Ban',
	2: 'Unban',
	3: 'Softban',
	4: 'Kick',
	5: 'Mute',
	6: 'Embed Restriction',
	7: 'Emoji Restriction',
	8: 'Reaction Restriction',
	9: 'Warn'
};

module.exports = class extends Command {
	constructor() {
		super('case', {
			aliases: ['case'],
			category: 'moderation',
			description: {
				content: 'Check out a case.',
				usage: '<case number>',
				example: ['12', '32']
			},
			userPermissions: ['MANAGE_GUILD']
		});
	}

	*args(message) {
		const totalCases = this.client.settings.get(message.guild.id, 'caseTotal', Infinity);
		const caseNum = yield {
			type: Argument.range('integer', 1, totalCases, true),
			prompt: {
				start: 'What case do you want to look up?',
				retry: 'Please enter a valid case number.'
			}
		};

		return { caseNum };
	}

	async exec(message, { caseNum }) {
		const db = await this.client.mongo.db('musico').collection('cases').findOne({ caseID: caseNum, guildID: message.guild.id });
		if (!db) {
			return message.reply('I couldn\'t find a case with that Id!');
		}

		const moderator = await message.guild.members.fetch(db.authorID);
		const color = Object.keys(CONSTANTS.ACTIONS).find(key => CONSTANTS.ACTIONS[key] === db.action).split(' ')[0].toUpperCase();

		const embed = this.client.util.embed();
		if (db.authorID !== null) embed.setAuthor(`${db.authorTag} (${db.authorID})`, moderator ? moderator.user.displayAvatarURL() : '');
		embed.setColor(CONSTANTS.COLORS[color]);
		embed.setDescription([
			`**Action:** ${ACTIONS[db.action]}${db.action === 5 ? `\n**Length:** ${db.action_duration ? ms(db.action_duration - db.createdAt, { long: true }) : 'Not Set'}` : ''}`,
			`**Member:** ${db.targetTag} (${db.targetID})`,
			`**Reason:** ${db.reason}${db.ref_id ? `\n**Ref case:** ${db.ref_id}` : ''}`
		]);
		embed.setFooter(`Case ${db.caseID}`);
		embed.setTimestamp(new Date(db.createdAt));

		return message.util.send(embed);
	}
};

