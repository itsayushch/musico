const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
module.exports = class TagInfoCommand extends Command {
	constructor() {
		super('tag-info', {
			category: 'tags',
			description: {
				content: 'Displays information about a tag.',
				usage: '<tag>'
			},
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS'],
			ratelimit: 2,
			args: [
				{
					id: 'tag',
					match: 'content',
					type: 'tag',
					prompt: {
						start: message => `${message.author}, What tag do you want information on?`,
						retry: (message, { phrase }) => `${message.author}, a tag with the name **${phrase} doesn't exist.`
					}
				}
			]
		});
	}

	async exec(message, { tag }) {
		const user = await this.client.users.fetch(tag.user);
		let lastModifiedBy;
		try {
			lastModifiedBy = await this.client.users.fetch(tag.last_modified);
		} catch (error) {
			lastModifiedBy = null;
		}
		const guild = this.client.guilds.cache.get(tag.guild);
		const embed = new MessageEmbed()
			.setColor(0x5e17eb)
			.addField('❯ Name', tag.name)
			.setAuthor(user ? user.tag : 'Couldn\'t fetch user.', user ? user.displayAvatarURL() : null)
			.setThumbnail(user ? user.displayAvatarURL() : null)
			.addField('❯ Guild', guild ? `${guild.name}` : 'Couldn\'t fetch guild.')
			.addField('❯ Aliases', tag.aliases.length ? tag.aliases.map(t => `**${t}**`).sort().join(', ') : 'No Aliases')
			.addField('❯ Uses', tag.uses)
			.addField('❯ Created at', moment.utc(tag.createdAt).format('MMM Do YYYY kk:mm'))
			.addField('❯ Modified at', moment.utc(tag.updatedAt).format('MMM Do YYYY, kk:mm'));
		if (lastModifiedBy) {
			embed.addField('❯ Last modified by', lastModifiedBy ? `${lastModifiedBy.tag} (ID: ${lastModifiedBy.id})` : 'Couldn\'t fetch user.');
		}
		return message.util.send(embed);
	}
};
