const { Command } = require('discord-akairo');

class AddBotCommand extends Command {
	constructor() {
		super('approve', {
			aliases: ['approve'],
			category: 'botlist',
			description: {
				content: 'You cannot use it bruh!'
			},
			ownerOnly: true,
			args: [
				{
					id: 'client',
					type: 'string',
					prompt: {
						start: 'Enter the client ID'
					}
				}
			]
		});
	}

	async exec(message, { client }) {
		await this.edit(message.author.id, client);
		await this.botLog(client, message.author);
	}

	async edit(user, clientID) {
		const db = await this.client.mongo.db('musico').collection('bots').updateOne({ clientID }, {
			$set: {
				approved: true,
				approvedBy: user
			}
		});

		return db;
	}

	async botLog(client, approvedBy) {
		const bot = await this.client.users.fetch(client);

		const embed = this.client.util.embed()
			.setColor(0x00ff00)
			.setTitle('Bot Approved')
			.setThumbnail(bot.displayAvatarURL({ size: 1024 }))
			.setDescription(`**${bot.tag} (${bot.id})** was approved by ${approvedBy}`)
			.setTimestamp();

		return this.client.channels.cache.get('808343180628983808').send(embed);
	}

	async hadndle(clientID) {
		const { ownerID } = await this.client.mongo.db('musico').collection('bots').findOne({ clientID });
		const guild = this.client.guilds.cache.get('694554848758202451');

		if (guild.members.cache.has(ownerID)) {
			this.client.users.cache.get(ownerID).send(`Congratulations your bot <@${clientID}> has been approved!`);
			guild.members.cache.get(ownerID).roles.add('808341405943463956');
			guild.members.cache.get(clientID).roles.add('808307235590766602');
		}
	}
}

module.exports = AddBotCommand;
