const { Listener } = require('discord-akairo');
const Logger = require('../../util/logger');

class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			event: 'ready',
			emitter: 'client',
			category: 'client'
		});
	}

	exec() {
		Logger.info(`${this.client.user.tag} (${this.client.user.id})`, { tag: 'READY' });
	}
}

module.exports = ReadyListener;
