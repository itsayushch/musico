const { Command, Flag } = require('discord-akairo');
const { stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');
module.exports = class extends Command {
	constructor() {
		super('delete', {
			aliases: ['delete', 'del'],
			description: {
				content: stripIndents`Available Keys
				• modlog
				• memberlog
				• messagelog`,

				usage: '<key>',
				examples: [
					'modlog',
					'memberlog',
					'messagelog'
				]
			},
			category: 'moderation',
			channel: 'guild',
			ratelimit: 2
		});
	}

	*args() {
		const method = yield {
			type: [
				['delete-modlog', 'modlog', 'mod-log'],
				['delete-memberlog', 'memberlog', 'member-log'],
				['delete-messagelog', 'messagelog', 'message-log']
			],
			otherwise: m => new MessageEmbed()
				.setColor('RED')
				.setTitle('Invalid Key Provided!')
				.addField('Available Keys', stripIndents`
						• modlog
						• memberlog
						• messagelog
					`)

		};

		return Flag.continue(method);
	}
};
