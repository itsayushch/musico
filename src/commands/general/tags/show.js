const { Command } = require('discord-akairo');
const { Util } = require('discord.js');
module.exports = class TagShowCommand extends Command {
	constructor() {
		super('tag-show', {
			description: {
				content: 'Displays a tag.',
				usage: '<tag>'
			},
			channel: 'guild',
			ratelimit: 2,
			args: [
				{
					id: 'name',
					match: 'content',
					type: 'lowercase',
					prompt: {
						start: message => `${message.author}, What tag would you like to see?`
					}
				}
			]
		});
	}

	async exec(message, { name }) {
		if (!name) { return; }
		name = Util.cleanContent(name, message);
		const tags = await this.client.mongo.db('musico').collection('tags').find({ guild: message.guild.id })
			.toArray();
		const tag = tags.filter(t => t.name === name || t.aliases.includes(name))[0];
		if (!tag) { return; }
		tag.uses += 1;
		this.client.tags.uses(tag.name, tag.uses);
		return message.util.send(tag.content);
	}
};
