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

	async exec() {
		await this.client.music.requestToken();
		Logger.info(`${this.client.user.tag} (${this.client.user.id})`, { tag: 'READY' });
	}
}

module.exports = ReadyListener;
