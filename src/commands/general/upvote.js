const { Command } = require('discord-akairo');

class UpdootCommand extends Command {
	constructor() {
		super('upvote', {
			aliases: ['vote', 'upvote'],
			category: 'general',
			channel: 'guild',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: {
				content: 'Send a link to vote for my bot',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		message.channel.send([
			'Here is the link:- ',
			'https://top.gg/bot/629283787095932938/vote',
			'**_Thanks In Advance_**'
		]);
	}
}

module.exports = UpdootCommand;
