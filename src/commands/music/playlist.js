const { stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');
const { Flag, Command } = require('discord-akairo');
module.exports = class PlaylistCommand extends Command {
	constructor() {
		super('playlist', {
			aliases: ['playlist', 'pl'],
			description: {
				content: stripIndents`
                     • \`${'create'.padEnd(8, ' ')}\` - Creates a playlist
                     • \`${'add'.padEnd(8, ' ')}\` - Adds a song/playlist to a playlist
                     • \`${'start'.padEnd(8, ' ')}\` - Stars playing the playlist's song(s)
                     • \`${'remove'.padEnd(8, ' ')}\` - Removes a song from the playlist
                     • \`${'edit'.padEnd(8, ' ')}\` - Edits the playlist's description
					 • \`${'current'.padEnd(8, ' ')}\` - Adds the current song to a playlist
					 • \`${'queue'.padEnd(8, ' ')}\` - Adds the current queue to a playlist
                     • \`${'delete'.padEnd(8, ' ')}\` - Deletes a playlist
                     • \`${'show'.padEnd(8, ' ')}\` - Shows all the tracks in a playlist
                     • \`${'info'.padEnd(8, ' ')}\` - Shows information of a playlist
                     • \`${'list'.padEnd(8, ' ')}\` - Lists the playlist for a guild member


                    For additional information on how to use, refer to the examples below.
                `,
				usage: '<subcommand> <...arguments>',
				examples: [
					'create Test',
					'create Test Some additional description',
					'add Test <song|url|playlist>',
					'remove Test 3',
					'current Test',
					'current Test',
					'edit Test Some other additional info',
					'show Test',
					'show Test 3',
					'info Test',
					'list @Ayush 2',
					'list @Ayush 2',
					'start Test'
				]
			},
			category: 'music',
			channel: 'guild',
			ratelimit: 2
		});
	}

	*args() {
		const method = yield {
			type: [
				['playlist-show', 'show'],
				['playlist-create', 'create'],
				['playlist-add', 'add'],
				['playlist-load', 'load', 'start'],
				['playlist-remove', 'rm', 'remove'],
				['playlist-delete', 'del', 'delete'],
				['playlist-edit', 'edit'],
				['playlist-info', 'info'],
				['playlist-list', 'list'],
				['playlist-current', 'current'],
				['playlist-queue', 'queue']
			],
			otherwise: message => {
				const p = this.handler.prefix(message);
				const embed = new MessageEmbed()
					.setColor('RED')
					.setTitle('Invalid Key Provided!')
					.setDescription(`Type **${p}help playlist** for information on this command`);
				return embed;
			}
		};
		return Flag.continue(method);
	}
};
