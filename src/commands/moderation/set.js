const { Command, Flag } = require('discord-akairo');
const { stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');
module.exports = class TagCommand extends Command {
	constructor() {
		super('set', {
			aliases: ['set'],
			description: {
				content: stripIndents`Available Keys
				• modlog \`[channel]\`
				• memberlog \`[channel]\`
				• messagelog \`[channel]\`

                Required: \`<>\` | Optional: \`[]\`

                For additional \`<...arguments>\` usage refer to the examples below.`,

				usage: '<key> <...arguments>',
				examples: [
					'modlog',
					'modlog #mod-channel',
					'memberlog',
					'memberlog #memberlog-channel',
					'messagelog',
					'messagelog #memberlog-channel'
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
				['set-modlog', 'modlog', 'mod-log'],
				['set-memberlog', 'memberlog', 'member-log'],
				['set-messagelog', 'messagelog', 'message-log']
			],
			otherwise: () => new MessageEmbed()
				.setColor('RED')
				.setTitle('Invalid Key Provided!')
				.addField('Available Keys', stripIndents`
					• modlog \`[channel]\`
					• memberlog \`[channel]\`
					• messagelog \`[channel]\`
				`)
		};

		return Flag.continue(method);
	}
};
