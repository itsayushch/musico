const { Command } = require('discord-akairo');
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
		console.log('\x1b[31m\x1b[47m\x1b[5mSHUTING DOWN!!!!!\x1b[0m');
		await message.channel.send({
			embed: {
				color: 'RED',
				description: '!!!RESTARTING!!!'
			}
		});
		console.log('\x1b[31m\x1b[47m\x1b[5mSHUTING DOWN!!!!!\x1b[0m');
		process.exit();
	}
}

module.exports = RebootCommand;
