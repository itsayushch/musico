const { Command } = require('discord-akairo');

class PrefixCommand extends Command {
	constructor() {
		super('prefix', {
			aliases: ['prefix'],
			cooldown: 1000,
			channel: 'guild',
			category: 'general',
			quoted: false,
			description: {
				content: 'Displays or changes the prefix of the guild.',
				usage: '<prefix>',
				examples: ['!', '?']
			},
			args: [
				{
					id: 'prefix',
					type: 'string',
					prompt: {
						retry: 'Please provide a prefix without spaces and less than 3 characters.',
						optional: true
					}
				}
			]
		});
	}

	exec(message, { prefix }) {
		try {
			if (!prefix) {
				return message.util.send(`The current prefix for this guild is \`${this.handler.prefix(message)}\``);
			}
			if (prefix && !message.member.permissions.has('MANAGE_GUILD')) {
				return message.util.send({
					embed: {
						color: 11642864,
						description: [
							`The current prefix for this guild is \`${this.handler.prefix(message)}\``,
							'You are missing `Manage Server` to change the prefix.'
						]
					}
				});
			}
			this.client.settings.set(message.guild.id, 'prefix', prefix);
			if (prefix === ';') {
				return message.util.send({
					embed: {
						color: 11642864,
						description: `The prefix has been reset to \`${prefix}\``
					}
				});
			}

			return message.util.send({
				embed: {
					color: 11642864,
					description: `The prefix has been set to \`${prefix}\``
				}
			});
		} catch (err) {
			message.channel.send(`The following error occured:-\n\`\`\`${err}\`\`\``);
		}
	}
}

module.exports = PrefixCommand;
