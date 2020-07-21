const { Inhibitor } = require('discord-akairo');

class MissingPermissionInhibitor extends Inhibitor {
	constructor() {
		super('MissingPermission', { reason: 'MissingPermission' });
	}

	exec(message, command) {
		if (!message.guild) return false;
		if (command.id === 'help') return false;
		return !message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES');
	}
}

module.exports = MissingPermissionInhibitor;
