const { Listener } = require('discord-akairo');
const Logger = require('../../util/logger');

class CommandStartedListener extends Listener {
	constructor() {
		super('commandStarted', {
			event: 'commandStarted',
			emitter: 'commandHandler',
			category: 'commandHandler'
		});
	}

	async exec(message, command, args) {
		const level = message.guild ? `${message.guild.name}/${message.author.tag}` : `${message.author.tag}`;
		Logger.log(`${command.id}`, { level });

		const embed = this.client.util.embed()
			.setColor('GREEN')
			.setTitle(`Command used - ${command.id}`)
			.setDescription(`\`\`\`js\n${command.id}-${level}\n${args ? args : ''}\`\`\``)
			.setTimestamp();
		return this.client.channels.cache.get('736088895128600598').send({ embed });
	}
}

module.exports = CommandStartedListener;
