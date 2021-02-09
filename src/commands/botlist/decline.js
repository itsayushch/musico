const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');
const { Message } = require('discord.js');

class DeclineCommand extends Command {
	constructor() {
		super('decline', {
			aliases: ['decline'],
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
				},
				{
					id: 'reason',
					type: 'string',
					match: 'rest',
					prompt: {
						start: 'What is the reason?'
					}
				}
			]
		});
	}

	/**
	 *
	 * @param {Message} message - The message object.
	 */
	async exec(message, { client, reason }) {
		await message.util.send(`Succesfully declined <@${client}>`);

		await this.botLog(client, message.author, reason);
		await this.handle(client, reason);
		await this.delete(client);

		return message.guild.members.cache.get(client).kick(reason);
	}

	async delete(clientID) {
		const db = await this.client.mongo.db('musico').collection('bots').deleteOne({ clientID });

		return db;
	}

	async botLog(client, declinedBy, reason) {
		const bot = await this.client.users.fetch(client);

		const embed = this.client.util.embed()
			.setColor(0xff6961)
			.setTitle('Bot Declined')
			.setThumbnail(bot.displayAvatarURL({ size: 1024 }))
			.setDescription(stripIndents`
				Bot Tag: \`${bot.tag}\`
				Bot ID: \`${bot.id}\`
				Moderator: ${declinedBy.tag} (${declinedBy.id})
				Reason: \`${reason}\`
			`)
			.setTimestamp();

		return this.client.channels.cache.get('808343180628983808').send(embed);
	}

	async handle(clientID, reason) {
		const { ownerID } = await this.client.mongo.db('musico').collection('bots').findOne({ clientID });

		const bot = await this.client.users.fetch(clientID);
		await this.client.users.cache.get(ownerID).send(stripIndents`
				Your bot **${bot.tag}** \`(${bot.id})\` was declined. 

				**Reason:**
				${reason}
			`);
	}
}

module.exports = DeclineCommand;
