const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');
class aboutCommand extends Command {
	constructor() {
		super('about', {
			aliases: ['about'],
			category: 'general',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: {
				content: 'About me ( the bot )',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message) {
		const aboutEmbed = this.client.util.embed()
			.setColor(message.member ? message.member.displayHexColor : 0x5e17eb)
			.setAuthor(this.client.user.username, this.client.user.avatarURL())
			.setTitle('My Insights')
			.setDescription(stripIndents`**___Hello I am Musico___**

			**What can I do ?**
			**_I can :-_**
			<:discord:711151112501329920> **Play \`Music\`**,
			<:discord:711151112501329920> **Manage your server with my \`Moderation\` commands**,

			**_AND MUCH MORE_**

			**_Just Type \`${this.handler.prefix(message)}help\` to get started!_**
			`)
			.addField('Internal Insights', stripIndents`
			**Developer** - [${this.owner.username}#${this.owner.discriminator}](https://ayushkr.me)
			**Language** - [Node.js®](https://nodejs.org)
			**Library** - [discord.js](https://discord.js.org/)
			**Framework** - [discord-akairo](https://discord-akairo.github.io)
			**VPS** - [AWS](https://aws.amazon.com)
			**Database** - [MongoDB](https://www.mongodb.com/)
			`)
			.addField('Support',
				stripIndents`
				**_If you like my features, please consider voting me on_** : [vote link](https://top.gg/bot/629283787095932938/vote)

				**_If you need any help you can join our_** [support server](https://discord.gg/sY57ftY)
			`)
			.setFooter(`© ${new Date().getFullYear()} ${this.owner.tag}`, this.owner.displayAvatarURL());

		message.channel.send(aboutEmbed);
	}

	get owner() {
		return this.client.users.cache.get(this.client.ownerID[0]);
	}
}

module.exports = aboutCommand;
