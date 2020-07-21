/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
const { Listener } = require('discord-akairo');
const { addBreadcrumb, Severity, setContext } = require('@sentry/node');

class CommandStartedListener extends Listener {
	constructor() {
		super('commandStarted', {
			event: 'commandStarted',
			emitter: 'commandHandler',
			category: 'commandHandler'
		});
	}

	async exec(message, command, args) {
		this.counter(message, command);

		const level = message.guild ? `${message.guild.name}/${message.author.tag}` : `${message.author.tag}`;

		addBreadcrumb({
			message: 'command_started',
			category: command.category.id,
			level: Severity.Info,
			data: {
				user: {
					id: message.author.id,
					username: message.author.tag
				},
				guild: message.guild
					? {
						id: message.guild.id,
						name: message.guild.name,
						channel_id: message.channel.id
					}
					: null,
				command: {
					id: command.id,
					aliases: command.aliases,
					category: command.category.id
				},
				message: {
					id: message.id,
					content: message.content
				},
				args
			}
		});
		setContext('command_started', {
			user: {
				id: message.author.id,
				username: message.author.tag
			},
			extra: {
				guild: message.guild
					? {
						id: message.guild.id,
						name: message.guild.name,
						channel_id: message.channel.id
					}
					: null,
				command: {
					id: command.id,
					aliases: command.aliases,
					category: command.category.id
				},
				message: {
					id: message.id,
					content: message.content
				},
				args
			}
		});
	}

	counter(message) {
	}
}

module.exports = CommandStartedListener;
