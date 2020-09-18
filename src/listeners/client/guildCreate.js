/* eslint-disable no-undef */
/* eslint-disable consistent-return */
const { Listener } = require('discord-akairo');
const Logger = require('../../util/logger');
const { stripIndents } = require('common-tags');
class GuildCreateListener extends Listener {
	constructor() {
		super('guildCreate', {
			event: 'guildCreate',
			emitter: 'client',
			category: 'client'
		});
	}

	async exec(guild) {
		Logger.info(`${guild.name} (${guild.id})`, { tag: 'GUILD CREATE' });

		const user = await this.client.users.fetch(guild.ownerID).catch(() => null);
		const channel = guild.channels.cache.filter(ch => ch.type === 'text').first();
		// const invite = await channel.createInvite({ maxAge: 0 }).catch(() => null);
		const id = this.client.settings.get('global', 'guildLog', '710854402977693748');
		const webhook = await this.client.fetchWebhook(id).catch(() => null);
		if (!webhook) return;
		const joinembed = this.client.util.embed()
			.setColor(11642864)
			.setAuthor('Hello, I am Musico', this.client.user.avatarURL())
			.setFooter(`© ${new Date().getFullYear()} ${this.owner.username}#${this.owner.discriminator}`, this.owner.displayAvatarURL())
			.setDescription(stripIndents`Thanks for inviting!
		**___Hello I am Musico___**

		My default prefix is \`;\`
		Want a new prefix? Just type \`;prefix <new prefix>\`

		To get a list of commands type \`;help\`
		To get details for each command type \`;help <command>\`

		I am a public bot and can be added to as many servers you want!
		You can invite me to other servers using : [invite link](https://discord.com/oauth2/authorize?client_id=629283787095932938&permissions=305482819&scope=bot)

		**What can I do ?**
		**_I can :-_**
		<:discord:711151112501329920> **Play \`Music\`**,
		<:discord:711151112501329920> **Manage your server with my \`Moderation\` commands**,
		<:discord:711151112501329920> **Some awesome \`utily\` commands you can play with.**,

		**_AND MUCH MORE_**

		**_Just Type \`;help\` to get started!_**
		`)
			.addField('Support', stripIndents`
		**_If you like my features, please consider voting me on_** : [vote link](https://top.gg/bot/629283787095932938/vote)

		**_If you need any help you can join our_** [support server](https://discord.gg/sY57ftY)
		`);
		if (guild.channels.cache.filter(ch => ch.name.includes('general') && ch.type === 'text').map(m => m).length) {
			guild.channels.cache.filter(ch => ch.name.includes('general') && ch.type === 'text').first().send(joinembed);
		} else { channel.send(joinembed); }

		const embed = this.client.util.embed()
			.setColor('GREEN')
			.setAuthor('Joined a Guild!')
			.setThumbnail(guild.iconURL())
			.setDescription(stripIndents`
            Name:
            \`${guild.name}\`

            Owner: 
            \`${user ? `${user.tag} (${user.id})` : 'Unknown'}\`

            ID: 
            \`${guild.id}\`

            Total Members: 
            \`${guild.memberCount}\`
        	`)
		  .setTimestamp();
	  return webhook.send({ embeds: [embed] });
	}

	get owner() {
		return this.client.users.cache.get(this.client.ownerID[0]);
	}
}

module.exports = GuildCreateListener;
