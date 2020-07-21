const { Command } = require('discord-akairo');

class ReloadallCommand extends Command {
	constructor() {
		super('reloadall', {
			aliases: ['reloadall', 'ra'],
			category: 'owner',
			ownerOnly: true,
			description: {
				content: 'You can\'t use this anyway, so why explain?'
			}
		});
	}

	async exec(message) {
		try {
			const inhibitor = this.client.inhibitorHandler.removeAll() && this.client.inhibitorHandler.loadAll();
			const listener = this.client.listenerHandler.removeAll() && this.client.listenerHandler.loadAll();
			const command = this.client.commandHandler.removeAll() && this.client.commandHandler.loadAll();

			if (inhibitor && listener && command) {
				const cmd = await this.client.commandHandler.modules.size;
				const listener = await this.client.listenerHandler.modules.size;
				const inhibitor = await this.client.inhibitorHandler.modules.size;
				return message.util.send({
					embed: {
						color: 0x73f805,
						description: `Reloaded ${cmd} commands, ${listener} listeners, ${inhibitor} inhibitors`
					}
				});
			}
		} catch (err) {
			message.channel.send(err);
		}
	}
}

module.exports = ReloadallCommand;
