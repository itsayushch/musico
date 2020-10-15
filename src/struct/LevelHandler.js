const moment = require('moment');

class LevelHandlder {
    constructor(client) {
        this.client = client;
        this.database = this.client.mongo.db('musico').collection('levels');
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

    setGuildMemberExp(member, exp) {
        return this.database.updateOne({ guild: member.guild.id, user: member.id }, {
            $set: { exp }
        }, { upsert: true });
    }

    giveGuildUserExp(member, message) {
        if (moment().diff(member.timeout || 0) < 0) return;
        member.timeout = moment().add(35, 'seconds');

        const oldExp = (await this.getGuildMemberExp(member)).exp;
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
