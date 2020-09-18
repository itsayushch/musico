const { Command } = require('discord-akairo');
const { Util } = require('discord.js');
const moment = require('moment');

class TagEditCommand extends Command {
	constructor() {
		super('tag-edit', {
			aliases: ['tag-edit'],
			category: 'tags',
			channel: 'guild',
			ratelimit: 2,
			flags: ['--hoist', '--pin', '--unhoist', '--unpin'],
			description: {
				content: 'Edit a tag (Markdown can be used).',
				usage: '<tag> [--hoist/--unhoist/--pin/--unpin] <content>',
				examples: ['Test Some new content', '"Test 1" Some more new content', 'Test --hoist', '"Test 1" --unpin']
			}
		});
	}

	// eslint-disable-next-line require-await
	async *args() {
		const tag = yield {
			type: 'tag',
			prompt: {
				start: 'What tag do you want to edit?',
				retry: (msg, { phrase }) => `a tag with the name **${phrase}** does not exist.`
			}
		};
		const hoist = yield {
			match: 'flag',
			flag: ['--pin', '--hoist']
		};
		const unhoist = yield {
			match: 'flag',
			flag: ['--unpin', '--unhoist']
		};
		const content = yield (
			hoist || unhoist
				? {
					match: 'rest',
					type: 'tagContent'
				}
				: {
					match: 'rest',
					type: 'tagContent',
					prompt: {
						start: 'What should the new content be?'
					}
				}
		);
		return { tag, hoist, unhoist, content };
	}

	async exec(message, { tag, hoist, unhoist, content }) {
		if (tag.user !== message.author.id) {
			return message.util.reply('You can only edit your own tags.');
		}
		if (content && content.length >= 1950) {
			return message.util.reply('Messages have a limit of 2000 characters!');
		}
		await this.client.tags.edit(message, tag.name, content ? content : tag.content, hoist, unhoist);
		return message.util.send({
			embed: { description: `Successfully edited **${tag.name}**${hoist ? ' to be hoisted.' : '.'}`, color: 11642864 }
		});
	}
}

module.exports = TagEditCommand;
