const { Listener } = require('discord-akairo');

class Message extends Listener {
	constructor() {
		super('message', {
			event: 'message',
			emitter: 'client',
			category: 'client'
		});
	}

	async exec(message) {
        if (!message.guild || message.guild.id !== '694554848758202451' || message.author.bot) return;
        
        const score = await this.client.settings.get(message.guild.id, message.author.id, {
            level: 0,
            experience: 0
        });

        const nextValue = score.experience + this.randomExp;
        const nextLevel = Math.floor(0.1 * Math.sqrt(nextValue));

        await this.client.settings.set(message.guild.id, message.author.id, {
            experience: nextValue,
            level: nextLevel,
        });

        if (score.level !== nextLevel) {
            return message.channel.send(`Congratulations ${message.author.toString()}! You leveled up to level **${nextLevel}**!`);
        }
    }
    get randomExp() {
        const max = 20; const min = 3;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

module.exports = Message;
