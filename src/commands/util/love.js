const { Command } = require('discord-akairo');
const { User, Message } = require('discord.js');
module.exports = class LoveCommand extends Command {
	constructor() {
		super('love', {
			aliases: ['love', 'affinity'],
			category: 'fun',
			description: {
				content: 'Calculates the love affinity the person has for you.',
				usage: 'user',
				examples: ['@Mirunalini', '709330769503584268']
			},
			args: [
				{
					id: 'person',
					type: 'user',
					prompt: {
						start: 'Who\'s love affinity you want to check?',
						retry: 'Not a valid user, try again'
					}
				}
			]
		});
	}

	/**
	 *
	 * @param {Message} message - message object
	 * @param {User} param1 - user object
	 */
	async exec(message, { person }) {
		const love =
			(message.author.id === '539770184236269568' && person.id === '709330769503584268') ||
			(message.author.id === '709330769503584268' && person.id === '539770184236269568')
				? this.getRandomInt(80, 100)
				: Math.random() * 100;

		const loveIndex = Math.floor(love / 10);
		const loveLevel = '💖'.repeat(loveIndex) + '💔'.repeat(10 - loveIndex);

		const embed = this.client.util.embed()
			.setColor('#ffb6c1')
			.addField(`☁ **${person.username}** loves **${message.author.username}** this much:`,
				`💟 ${Math.floor(love)}%\n\n${loveLevel}`);

		return message.util.send(embed);
	}

	getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
};
