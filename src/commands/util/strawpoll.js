const { Command } = require('discord-akairo');
const fetch = require('node-fetch');

class SayCommand extends Command {
	constructor() {
		super('strawpoll', {
			aliases: ['strawpoll', 'poll'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			args: [
				{
					id: 'title',
					type: 'string',
					prompt: {
						start: 'What should the title of the poll be?'
					}
				},
				{
					id: 'options',
					type: 'string',
					prompt: {
						start: 'What the options should be? [Note: Please seperate the options with \`|\`]'
					},
					match: 'rest'
				},
				{
					id: 'multi',
					match: 'flag',
					flag: '--multi'
				}
			],
			description: {
				content: 'Simply create strawpoll ( use | to separate the options )',
				usage: '[title] [options]',
				examples: ['"am i cool?" hell yea | nah | you suck!']
			}
		});
	}

	async exec(message, args) {
		const options = args.options.trim().split('|');


		const request = {
			'title': args.title,
			options,
			'multi': args.multi
		};

		fetch('https://www.strawpoll.me/api/v2/polls', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(request)
		}).then(response => response.json()).then(response => message.channel.send(` Your strawpoll is ready! https://www.strawpoll.me/${response.id}`));
	}
}

module.exports = SayCommand;
