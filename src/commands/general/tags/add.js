const { Command } = require('discord-akairo');
const { Util } = require('discord.js');
module.exports = class TagAddCommand extends Command {
	constructor() {
		super('tag-add', {
			category: 'tag',
			description: {
				content: {
					description: 'Adds a tag, usable for everyone on the server'
				},
				usage: '[--hoist/--pin] <tag> <content>',
				examples: ['Test Test', '--hoist "Test 2" Test2', '"Test 3" "Some more text" --hoist']
			},
			channel: 'guild',
			ratelimit: 2,
			args: [
				{
					id: 'name',
					type: 'existingTag',
					prompt: {
						start: 'What should the tag be named?',
						retry: 'This tag already exits'
					}
				},
				{
					id: 'content',
					match: 'rest',
					type: 'string',
					prompt: {
						start: 'What should the content of the tag be?'
					}
				},
				{
					id: 'hoist',
					match: 'flag',
					flag: ['--hoist', '--pin']
				}
			]
		});
	}

	async exec(message, { name, content, hoist }) {
		if (name && name.length >= 256) {
			return message.util.send({
				embed: { author: { name: 'Tag name has a limit of 256 characters!' }, color: 11642864 }
			});
		}
		if (content && content.length >= 1950) {
			return message.util.send({
				embed: { author: { name: 'Tag content has a limit of 2000 characters!' }, color: 11642864 }
			});
		}

		await this.client.tags.add(message, name, content, hoist);

		return message.util.send({
			embed: { description: `Tag with the name **${name.substring(0, 256)}** has been added.`, color: 11642864 }
		});
	}
};
