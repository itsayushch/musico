const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const qs = require('querystring');
const Turndown = require('turndown');

class MDNCommand extends Command {
	constructor() {
		super('mdn', {
			aliases: ['mdn', 'mozilla-developer-network'],
			category: 'general',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					id: 'query',
					prompt: {
						start: 'what would you like to search for?',
						retry: 'Try again!',
						cancel: 'Type cancel to cancel'
					},
					match: 'content',
					type: (_, query) => query ? query.replace(/#/g, '.prototype.') : null
				}
			],
			description: {
				content: 'Searches MDN for your query.',
				usage: '<query>',
				examples: ['Map', 'Map#get', 'Map.set']
			}
		});
	}

	async exec(message, { query, match }) {
		if (!query && match) query = match[1];
		const queryString = qs.stringify({ q: query });
		const res = await fetch(`https://mdn-api.vercel.app/?${queryString}`);
		const body = await res.json();
		if (!body.url || !body.title || !body.summary) {
			return message.util.reply('I couldn\'t find the requested information.');
		}
		const turndown = new Turndown();
		turndown.addRule('hyperlink', {
			filter: 'a',
			replacement: (text, node) => `[${text}](https://developer.mozilla.org${node.href})`
		});
		// eslint-disable-next-line no-useless-escape
		const summary = body.summary.replace(/<code><strong>(.+)<\/strong><\/code>/g, '<strong><code>$1<\/code><\/strong>');

		const embed = new MessageEmbed()
			.setColor(11642864)
			.setAuthor('MDN', 'https://i.imgur.com/DFGXabG.png', 'https://developer.mozilla.org/')
			.setURL(body.url)
			.setTitle(body.title)
			.setDescription(turndown.turndown(summary));

		return message.util.send({ embed });
	}
}

module.exports = MDNCommand;
