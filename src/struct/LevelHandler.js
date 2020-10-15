/* eslint-disable no-mixed-operators */
const moment = require('moment');

class LevelHandlder {
	constructor(client) {
		this.client = client;
		this.database = this.client.mongo.db('musico').collection('levels');
		this.cached = new Set();
	}

	getLevelExp(level) {
		return 5 * Math.pow(level, 2) + 50 * level + 100;
	}

	static randomInt(low, high) {
		return Math.floor(Math.random() * (high - low + 1) + low);
	}

	getLevelFromExp(exp) {
		let level = 0;

		while (exp >= this.getLevelExp(level)) {
			exp -= this.getLevelExp(level);
			level++;
		}

		return level;
	}

	getLevelProgress(exp) {
		let level = 0;

		while (exp >= this.getLevelExp(level)) {
			exp -= this.getLevelExp(level);
			level++;
		}

		return exp;
	}

	getLeaderboard(guild) {
		return this.database.find({ guild }).toArray();
	}

	async getGuildMemberExp(member) {
		const data = await this.database.findOne({
			user: member.id
		});
		return data;
	}

	async setGuildMemberExp(member, exp) {
		const data = await this.database.updateOne({ guild: member.guild.id, user: member.id }, {
			$set: { exp }
		}, { upsert: true });

		return data;
	}

	async giveGuildUserExp(member, message) {
		if (this.cached.has(member.id)) return;

		this.cached.add(member.id);
		setTimeout(() => {
			this.cached.delete(member.id);
		}, 45000);

		let oldExp = await this.getGuildMemberExp(member);
		oldExp = oldExp.exp;
		const oldLvl = this.getLevelFromExp(oldExp);
		const newExp = oldExp + LevelHandlder.randomInt(15, 25);
		const newLvl = this.getLevelFromExp(newExp);

		await this.setGuildMemberExp(member, newExp);

		if (oldLvl !== newLvl) {
			await message.util.send(`Congratulations ${message.author.toString()}! You leveled up to level **${newLvl}**!`);
		}
	}
}

module.exports = LevelHandlder;
