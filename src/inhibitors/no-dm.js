const { Inhibitor } = require('discord-akairo');

class NoDMInhibitor extends Inhibitor {
	constructor() {
		super('no-dm', {
			reason: 'no-dm'
		});
	}

	exec(message) {
		if (!message.guild) {
			if (message.author.id === this.client.ownerID[0]) return false;
			return true;
		}
	}
}

module.exports = NoDMInhibitor;
