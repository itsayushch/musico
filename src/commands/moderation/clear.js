const { Argument, Command } = require('discord-akairo');

class PruneCommand extends Command {
	constructor() {
		super('prune', {
			aliases: ['clear', 'prune', 'clean', 'purge'],
			category: 'admin',
			args: [
				{
					id: 'amount',
					type: Argument.range('integer', 0, 100, true),
					prompt: {
						start: 'How many messages do you want to clear?',
						retry: 'Please enter a valid number from 1 -100.'
					}
				},
				{
					id: 'user',
					type: 'user',
					prompt: {
						retry: 'please specify a valid user.',
						optional: true
					}
				}
			],
			description: {
				content: 'Clears messages in a bulk.',
				usage: '<amount> [user]',
				examples: ['10', '15 @Ayush']
			}
		});
	}

	exec(message, { user, amount }) {
		message.channel.messages.fetch({
			limit: 100
		}).then(messages => {
			if (user) {
				messages = messages.filter(msg => msg.author.id === user.id).array().slice(0, amount);
			} else if (!user) {
				messages = messages.array().slice(0, amount);
			}

			message.channel.bulkDelete(messages).catch(error => {
				if (error) return message.util.reply('you can only bulk delete messages that are under 14 days old.');
			});
		});
	}
}

module.exports = PruneCommand;
