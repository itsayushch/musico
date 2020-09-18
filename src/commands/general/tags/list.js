const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
module.exports = class TagListCommand extends Command {
	constructor() {
		super('tag-list', {
			aliases: ['tags'],
			description: {
				content: 'Lists all server tags.'
			},
			category: 'general',
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS'],
			ratelimit: 2,
			args: [
				{
					id: 'member',
					type: 'member'
				}
			]
		});
	}

	async exec(message, { member }) {
		if (member) {
			const tags = await this.client.mongo.db('musico').collection('tags').find({ user: member.id, guild: message.guild.id })
				.toArray();
			if (!tags.length) {
				if (member.id === message.author.id) { return message.util.reply('You don\'t have any tags.'); }
				return message.util.reply(`**${member.displayName}** doesn't have any tags.`);
			}
			const embed = new MessageEmbed()
				.setColor(11642864)
				.setAuthor(`**${member.user.tag} (${member.id})`, member.user.displayAvatarURL())
				.setDescription(tags.map(tag => `\`${tag.name}\``)
					.sort()
					.join(', '));
			return message.util.send(embed);
		}
		const tags = await this.client.mongo.db('musico').collection('tags').find({ guild: message.guild.id })
			.toArray();
		if (!tags.length) {
			return message.util.send({
				embed: { description: `**${message.guild.name}** doesn't have any tags.`, color: 11642864 }
			});
		}
		const hoistedTags = tags.filter(tag => tag.hoisted).map(tag => `\`${tag.name}\``).sort()
			.join(', ');

		const userTags = tags.filter(tag => !tag.hoisted).filter(tag => tag.user === message.author.id).map(tag => `\`${tag.name}\``)
			.sort()
			.join(', ');

		const embed = new MessageEmbed().setColor(11642864)
			.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL());

		if (hoistedTags) embed.addField('❯ Tags', hoistedTags);
		if (userTags) embed.addField(`❯ ${message.member.displayName}'s tags`, userTags);

		if (!hoistedTags && !userTags) embed.setDescription('**There are no tags for this guild. Why not add some?**');

		return message.util.send(embed);
	}
};
