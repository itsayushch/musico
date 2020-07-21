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
				• memberlog`,

				usage: '<key>',
				examples: [
					'modlog',
					'memberlog'
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
				['delete-modlog', 'modlog'],
				['delete-memberlog', 'memberlog']
			],
			otherwise: m => new MessageEmbed()
				.setColor('RED')
				.setTitle('Invalid Key Provided!')
				.addField('Available Keys', stripIndents`
						• modlog
						• memberlog
					`)

		};

		return Flag.continue(method);
	}
};
