const { Command } = require('discord-akairo');

class TagDeleteCommand extends Command {
	constructor() {
		super('tag-delete', {
			aliases: ['tag-delete'],
			category: 'tags',
			channel: 'guild',
			ratelimit: 2,
			args: [
				{
					id: 'tag',
					match: 'content',
					type: 'tag',
					prompt: {
						start: 'What tag do you want to delete?',
						retry: (msg, { phrase }) => `A tag with the name **${phrase}** does not exist.`
					}
				}
			],
			description: {
				content: 'Deletes a tag.',
				usage: '<tag>'
			}
		});
	}

	async exec(message, { tag }) {
		if (tag.user !== message.author.id) return message.util.reply('You can only delete your own tags.');
		await this.client.tags.delete(tag.name);
		return message.util.send({
			embed: { description: `Successfully deleted the tag **\`${tag.name.substring(0, 256)}\`**.`, color: 'RED' }
		});
	}
}

module.exports = TagDeleteCommand;
