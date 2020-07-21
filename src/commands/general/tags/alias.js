const { Command } = require('discord-akairo');

class TagAliasCommand extends Command {
	constructor() {
		super('tag-alias', {
			aliases: ['tag-alias'],
			category: 'tags',
			channel: 'guild',
			ratelimit: 2,
			flags: ['--add', '--del', '--delete'],
			description: {
				usage: '<--add/--del> <tag> <tagalias>',
				examples: ['--add Test1 Test2', '--del "Test 2" "Test 3"', '"Test 3" "Test 4" --add']
			}
		});
	}

	*args() {
		const first = yield {
			type: 'tag',
			prompt: {
				start: 'What\'s the tag you want to alias?',
				retry: (msg, { phrase }) => `a tag with the name **${phrase}** does not exist.`
			}
		};
		const add = yield {
			match: 'flag',
			flag: ['--add']
		};
		const del = yield {
			match: 'flag',
			flag: ['--del', '--delete']
		};
		const second = yield (
			del
				? {
					match: 'rest',
					type: (msg, phrase) => {
						if (!phrase) return null;
						if (first.aliases.includes(phrase)) return phrase;
					},
					prompt: {
						start: 'What the alias you want to remove from this tag?',
						retry: (msg, { phrase }) => `A tag alias with the name **${phrase}** doesn't exists.`
					}
				}
				: {
					match: 'rest',
					type: 'existingTag',
					prompt: {
						start: 'What the alias you want to apply to this tag?',
						retry: (msg, { phrase }) => `A tag with the name **${phrase}** already exists.`
					}
				}
		);
		return { first, second, add, del };
	}

	async exec(message, { first, second, add, del }) {
		const new_alias = second;

		if (add) {
			if (second && second.length >= 256) {
				return message.util.send({
					embed: { author: { name: 'Tag name has a limit of 256 characters!' }, color: 'RED' }
				});
			}
			await this.client.tags.aliasesadd(message, first.name, new_alias);
		} else if (del) {
			const removed_alias = await first.aliases.filter(id => id !== second);
			await this.client.tags.aliasesdel(message, first.name, removed_alias);
		} else {
			return message.util.send({
				embed: { author: { name: 'You have to either supply `--add` or `--del`' }, color: 'RED' }
			});
		}
		return message.util.send({
			embed: { description: `Alias **${second.substring(0, 256)}** ${add ? 'added to' : 'deleted from'} tag **${first.name}**.`, color: 0x5e17eb }
		});
	}
}

module.exports = TagAliasCommand;
