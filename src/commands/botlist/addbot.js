const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');

class AddBotCommand extends Command {
	constructor() {
		super('addbot', {
			aliases: ['addbot', 'ab'],
			category: 'botlist',
			description: {
				content: 'Adds your bot to the server.',
				usage: '<Client ID> <prefix>',
				examples: ['761469922563063818 m!']
			},
			args: [
				{
					id: 'client',
					type: 'string',
					prompt: {
						start: 'Enter the client ID'
					}
				},
				{
					id: 'prefix',
					type: 'string',
					prompt: {
						start: 'Enter the prefix of the bot'
					}
				}
			]
		});
	}

	async exec(message, { client, prefix }) {
		const embed = this.client.util.embed()
			.setColor(0xb1a7f0)
			.setTitle('Bot Submitted')
			.setDescription(stripIndents`
				**OWNER:** ${message.author.tag} (${message.author.id})
				**BOT:** ${client}
				**PREFIX:** ${prefix}
				**INVITE URL:** ${this.generateInvite(client)}
			`);

		await message.channel.send(`${message.author} your bot has been added to the list.\nPlease wait untill we test and verify it.\n\nThank you!`);

		await this.save(message.author.id, client, prefix);

		return this.client.channels.cache.get('808324664165924934').send(embed);
	}

	async save(ownerID, clientID, prefix) {
		const db = await this.client.mongo.db('musico').collection('bots').insertOne({
			ownerID,
			clientID,
			prefix,
			submittedAt: new Date()
		});

		return db;
	}

	generateInvite(id) {
		return `https://discordapp.com/oauth2/authorize?client_id=${id}&scope=bot&permissions=0`;
	}
}

module.exports = AddBotCommand;
