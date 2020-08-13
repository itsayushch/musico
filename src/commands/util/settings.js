const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');
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
		const Messagelog = await this.client.settings.get(message.guild.id, 'message-log');
		const embed = this.client.util.embed()
			.setColor(0x5e17eb)
			.setDescription(stripIndents`
				❯ Prefix
				• \`${this.handler.prefix(message)}\`

				❯ Member Log Channel
				• ${Memberlog ? `<#${Memberlog}>` : '<:no:705748651418452030> None'}

				❯ Mod Log Channel
				• ${Modlog ? `<#${Modlog}>` : '<:no:705748651418452030> None'}

				❯ Message Log Channel
				• ${Messagelog ? `<#${Messagelog}>` : '<:no:705748651418452030> None'}
			`)
			.setAuthor(`Settings for ${message.guild.name}`, message.guild.iconURL());
		return message.channel.send(embed);
	}
};
