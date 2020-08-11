const { Command } = require('discord-akairo');

class HelpCommand extends Command {
	constructor() {
		super('help', {
			aliases: ['help', 'command', 'h'],
			category: 'general',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					id: 'command',
					type: 'commandAlias'
				}
			],
			description: {
				content: 'Displays a list of commands or information about a command.',
				usage: '[command]',
				examples: ['ping', 'wallpaper', 'kick']
			}
		});
	}

	exec(message, { command }) {
		if (!command) return this.execCommandList(message);

		const description = Object.assign({
			content: 'No description available.',
			usage: '',
			examples: [],
			fields: []
		}, command.description);

		const embed = this.client.util.embed()
			.setColor(0x5e17eb)
			.setTitle(`\`${this.handler.prefix(message)}${command.aliases[0]} ${description.usage}\``)
			.addField('• Description', description.content);

		for (const field of description.fields) embed.addField(field.name, field.value);

		if (description.examples.length) {
			const text = `${this.handler.prefix(message)}${command.aliases[0]}`;
			embed.addField('• Examples', `\`${text} ${description.examples.join(`\`\n\`${text} `)}\``, true);
		}

		if (command.aliases.length > 1) {
			embed.addField('• Aliases', `\`${command.aliases.join('` `')}\``, true);
		}

		return message.util.send({ embed });
	}

	async execCommandList(message) {
		const embed = this.client.util.embed()
			.setColor(0x5e17eb)
			.setDescription(`<a:pin:711108642551758869> **Command List**\nThis is a list of commands.\nTo view details for a command, do \`${this.handler.prefix(message)}help <command>\``)
			.addField('Some Usefull Links', '[Invite Link](https://discord.com/oauth2/authorize?client_id=629283787095932938&permissions=305482819&scope=bot) | [Support Server](https://discord.gg/sY57ftY) | [Source Code](https://github.com/gwatech/musico)')
			.setFooter(`© ${new Date().getFullYear()} ${this.owner.tag}`, this.owner.displayAvatarURL());
		for (const category of this.handler.categories.values()) {
			const title = {
				general: 'General',
				utility: 'Utility',
				music: 'Music',
			        moderation: 'Moderation'
			}[category.id];

			if (title) { embed.addField(title, `${category.map(cmd => `\`${cmd.aliases[0]}\``).join(', ')}`); }
		}

		const shouldReply = message.guild && message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES');

		try {
			await message.util.send({ embed });
		} catch (err) {
			if (shouldReply) return message.util.reply(`I could not send you the command list ${err}`);
		}

		return undefined;
	}

	get owner() {
		return this.client.users.cache.get(this.client.ownerID[0]);
	}
}

module.exports = HelpCommand;
