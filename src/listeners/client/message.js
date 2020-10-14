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
        if (!message.guild || message.guild.id !== '694554848758202451') return;
        
        const score = await this.client.settings.get(message.guild.id, message.author.id, {
            level: 0,
            experience: 0
        });

        const nextValue = score.experience + 1;
        const nextLevel = Math.floor(0.1 * Math.sqrt(score.level + 1));

        await this.client.settings.set(message.guild.id, message.author.id, {
            experience: nextValue,
            level: nextLevel,
        });

        if (score.level !== nextLevel) {
            return message.channel.send(`Congratulations ${message.author.toString()}! You leveled up to level **${nextLevel}**!`);
        }
	}
}

module.exports = Message;
