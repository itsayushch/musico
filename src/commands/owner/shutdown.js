const { Command } = require('discord-akairo');
const Logger = require('../../util/logger');
class RebootCommand extends Command {
	constructor() {
		super('shutdown', {
			aliases: ['shutdown', 'dead', 'shut'],
			category: 'owner',
			ownerOnly: true,
			quoted: false,
			description: {
				content: 'You can\'t use this anyway, so why explain?'
			}
		});
	}

	async exec(message) {
		Logger.info(`${this.client.user.tag} (${this.client.user.id})`, { tag: 'RESTARTING' });
		await message.channel.send({
			embed: {
				color: 'RED',
				description: '**RESTARTING**'
			}
		});
		process.exit();
	}
}

module.exports = RebootCommand;
