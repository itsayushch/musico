/* eslint-disable no-undef */
/* eslint-disable consistent-return */
const { Listener } = require('discord-akairo');
const Logger = require('../../util/logger');

class GuildDeleteListener extends Listener {
	constructor() {
		super('guildDelete', {
			event: 'guildDelete',
			emitter: 'client',
			category: 'client'
		});
	}

	async exec(guild) {
		Logger.info(`${guild.name} (${guild.id})`, { level: 'GUILD DELETE' });

		this.client.settings.clear(guild);

		const user = await this.client.users.fetch(guild.ownerID).catch(() => null);
		const id = this.client.settings.get('global', 'guildLog', '710854402977693748');
		const webhook = await this.client.fetchWebhook(id).catch(() => null);
		if (!webhook) return;

		const embed = this.client.util.embed()
			.setColor('RED')
			.setAuthor('Musico - Removed from Guild!')
			.setThumbnail(guild.iconURL())
			.addField('Guild Info', [
				`Name: ${guild.name}`,
				`ID: ${guild.id}`,
				`Made: ${guild.createdAt}`,
				`Owner: ${user ? user.tag : 'Unknown'} (ID: ${guild.ownerID})`,
				`Region: ${guild.region}`,
				`Roles: ${guild.roles.size}`,
				`Verification Level: ${guild.verificationLevel}`,
				`Members: ${guild.memberCount}`
			])
			.setTimestamp();
		return webhook.send({ embeds: [embed] });
	}
}

module.exports = GuildDeleteListener;
