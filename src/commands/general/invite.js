const { Command } = require('discord-akairo');
const supportServer = 'https://discord.gg/sY57ftY';

class InviteCommand extends Command {
	constructor() {
		super('invite', {
			aliases: ['invite'],
			category: 'general',
			clientPermissions: ['SEND_MESSAGES'],
			description: {
				content: 'Send invite link for GWA TECH',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		return message.util.send('https://discord.gg/sY57ftY');
	}
		
}

module.exports = InviteCommand;
