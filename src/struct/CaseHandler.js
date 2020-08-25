/* eslint-disable no-mixed-operators */

class TagHandler {
	constructor(client) {
		this.client = client;
		this.database = this.client.mongo.db('musico').collection('cases');
	}

	create(message, member, totalCases, action, modMessage, reason) {
		return this.database.updateOne({}, {
			$set: {
				caseID: totalCases,
				targetID: member.id,
				targetTag: member.user.tag,
				authorTag: message.author.tag,
				authorID: message.author.id,
				guildID: message.guild.id,
				messageID: modMessage ? modMessage.id : undefined,
				action,
				reason,
				createdAt: new Date()
			}
		}, { upsert: true });
	}

	update(message, caseNum, reason) {
		return this.database.updateOne({ caseID: caseNum, guildID: message.guild.id }, {
			$set: {
				authorID: message.author.id,
				authorTag: message.author.tag,
				reason,
				updatedAt: new Date()
			}
		}, { upsert: true });
	}
}

module.exports = TagHandler;
