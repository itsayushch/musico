const { Command } = require('discord-akairo');
const { Util, MessageEmbed } = require('discord.js');
module.exports = class SearchTagCommand extends Command {
	constructor() {
		super('tag-search', {
			category: 'tags',
			description: {
				content: 'Searches a tag.',
				usage: '<tag>'
			},
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS'],
			ratelimit: 2,
			args: [
				{
					id: 'name',
					match: 'content',
					type: 'lowercase',
					prompt: {
						start: message => `${message.author}, What would you like to search for?`
					}
				}
			]
		});
	}

	async exec(message, { name }) {
		name = Util.cleanContent(name, message);
		const tags = await this.client.mongo.db('musico').collection('tags').find({ name: new RegExp(`^${name}$`, 'i') })
			.toArray();
		if (!tags.length) {
			return message.util.send({
				embed: { description: `No results found for query ${name}.`, color: 0x5e17eb }
			});
		}
		const search = tags
			.map(tag => `\`${tag.name}\``)
			.sort()
			.join(', ');
		if (search.length >= 1950) {
			return message.util.send({
				embed: { description: 'Try using a smaller query.', color: 0x5e17eb }
			});
		}
		const embed = new MessageEmbed()
			.setColor(0x5e17eb)
			.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
			.setDescription(search);
		return message.util.send(embed);
	}
};
