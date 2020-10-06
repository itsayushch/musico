const { Command } = require('discord-akairo');
const { Util } = require('discord.js');
module.exports = class PlaylistEditCommand extends Command {
	constructor() {
		super('playlist-edit', {
			description: {
				content: 'Edits the description of a playlist.',
				usage: '<playlist> <info>'
			},
			channel: 'guild',
			ratelimit: 2,
		});
	}

	async *args() {
		const playlist = yield {
			type: 'playlist',
			prompt: {
				start: 'What playlists description do you want to edit?',
				retry: (msg, { phrase }) => `A playlist with the name **${phrase}** does not exist.`
			}
		};
		const name = yield {
			match: 'flag',
			flag: ['--name', '-n']
		};
		const des = yield {
			match: 'flag',
			flag: ['--des', '--description', '-d']
		};
		const info = yield (
			des
				? {
					match: 'rest',
					prompt: {
						start: 'What should the new description be?'
					}
				} 
				: {
					match: 'rest',
					prompt: {
						start: 'What\'s the new name you want to apply to this playlist?'
					}
				}
		);
		return { playlist, info, name, des };
	}

	async exec(message, { playlist, info, name, des }) {

		if (playlist.user !== message.author.id) { return message.util.reply('You can only edit your own playlists.'); }
		
		if (name) {
			await this.client.playlist.editname(playlist.name, Util.cleanContent(info, message));
		} else if (des) {
			playlist.description = Util.cleanContent(info, message);
			await this.client.playlist.editdesc(playlist.name, playlist.description);
		} else {
			return message.util.send({
				embed: {
					color: 11642864,
					description: 'You have to either supply `--name` or `--des`'
				}
			});
		}
		return message.util.send({
			embed: {
				color: 11642864,
				description: `Successfully updated the description for **${playlist.name}**.`
			}
		});
	}
};
