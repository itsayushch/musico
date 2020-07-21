const { Command, Flag } = require('discord-akairo');
const { stripIndents } = require('common-tags');
module.exports = class TagCommand extends Command {
	constructor() {
		super('tag', {
			aliases: ['tag'],
			description: {
				content: stripIndents`Available methods:
                    • show \`<tag>\`
                    • add \`[--hoist/--pin] <tag> <content>\`
                    • alias \`<--add/--del> <tag> <tagalias>\`
                    • del \`<tag>\`
                    • edit \`[--hoist/--unhoist] <tag> <content>\`
                    • source \`[--file] <tag>\`
                    • info \`<tag>\`
                    • search \`<tag>\`
                    • list \`[member]\`
                    • download \`[member]\`

                   Required: \`<>\` | Optional: \`[]\`

                   For additional \`<...arguments>\` usage refer to the examples below.`,

				usage: '<method> <...arguments>',
				examples: [
					'show Test',
					'add Test Test',
					'add --hoist/--pin "Test 2" Test2',
					'alias --add Test1 Test2',
					'alias --del "Test 2" "Test 3"',
					'del Test',
					'edit Test Some new content',
					'edit "Test 1" Some more new content',
					'edit Test --hoist',
					'edit Test --unhoist Some more new content',
					'source Test',
					'source --file Test',
					'info Test',
					'search Test',
					'list @Ayush',
					'download @Ayush'
				]
			},
			category: 'general',
			channel: 'guild',
			ratelimit: 2
		});
	}

	*args() {
		const method = yield {
			type: [
				['tag-show', 'show'],
				['tag-add', 'add'],
				['tag-alias', 'alias'],
				['tag-delete', 'del', 'delete', 'remove', 'rm'],
				['tag-edit', 'edit'],
				['tag-source', 'source'],
				['tag-info', 'info'],
				['tag-search', 'search'],
				['tag-list', 'list'],
				['tag-download', 'download', 'dl']
			],
			otherwise: message => {
				const prefix = this.handler.prefix(message);
				return `When you beg me so much I just can't not help you~\nCheck \`${prefix}help tag\` for more information.`;
			}
		};

		return Flag.continue(method);
	}
};
