const { Command } = require('discord-akairo');
module.exports = class TagCommand extends Command {
	constructor() {
		super('settings', {
			aliases: ['settings'],
			description: {
				content: 'Displays the guild\'s current settings.'
			},
			category: 'utility',
			channel: 'guild',
			ratelimit: 2
		});
	}

	async exec(message) {
		const Memberlog = await this.client.settings.get(message.guild.id, 'member-log');
		const Modlog = await this.client.settings.get(message.guild.id, 'mod-log');
		const embed = this.client.util.embed()
			.setColor()
			.setAuthor(`Settings for ${message.guild.name}`, message.guild.iconURL())
			.addField('Prefix', `\`${this.handler.prefix(message)}\``)
			.addField('Member Log Channel', Memberlog ? `<#${Memberlog}>` : '<:no:705748651418452030> None')
			.addField('Mod Log Channel', Modlog ? `<#${Modlog}>` : '<:no:705748651418452030> None');

		return message.channel.send(embed);
	}
};
