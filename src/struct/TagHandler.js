/* eslint-disable no-mixed-operators */
const { Util } = require('discord.js');

class TagHandler {
	constructor(client) {
		this.client = client;
		this.database = this.client.mongo.db('musico').collection('tags');
	}

	add(message, tag, info, hoist = false) {
		return this.database
			.updateOne({ name: tag }, {
				$push: { aliases: { $each: [tag] } },
				$set: {
					guild: message.guild.id,
					user: message.author.id,
					content: Util.cleanContent(info, message),
					hoisted: hoist,
					uses: 0,
					createdAt: new Date(),
					updatedAt: new Date(),
					last_modified: message.author.id
				}
			},
			{ upsert: true });
	}

	aliasesadd(message, name, aliases) {
		return this.database
			.updateOne({ name }, {
				$push: { aliases },
				$set: { last_modified: message.author.id }
			},
			{ upsert: true });
	}

	aliasesdel(message, name, aliases) {
		return this.database
			.updateOne({ name }, {
				$pull: { aliases },
				$set: { last_modified: message.author.id }
			},
			{ upsert: true });
	}

	delete(name) {
		return this.database.findOneAndDelete({ name });
	}

	edit(message, tag, info, hoist, unhoist) {
		return this.database
			.updateOne({
				name: tag
			},
			{
				$set: {
					hoisted: hoist ? true : tag.hoisted || unhoist ? false : tag.hoisted,
					content: info ? Util.cleanContent(info, message) : tag.content,
					last_modified: message.author.id,
					updatedAt: new Date()
				}
			},
			{ upsert: true });
	}

	uses(name, uses) {
		return this.database
			.updateOne({
				name
			},
			{ $set: { uses } },
			{ upsert: true });
	}
}

module.exports = TagHandler;
