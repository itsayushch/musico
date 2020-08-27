const { Command } = require('discord-akairo');

class ClearDuplicateCommand extends Command {
	constructor() {
		super('clear-duplicate', {
			aliases: ['cleardupes', 'removedupes', 'rd'],
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: 'Removes duplicate songs from the queue.',
				examples: ['']
			},
			category: 'music',
			channel: 'guild'
		});
	}

	async exec(message) {
		const queue = this.client.music.queues.get(message.guild.id);
		const tracks = await queue.tracks();
		if (!tracks.length) {
			return message.util.send({
				embed: { description: 'You must be playing a track to use this command!', color: 0x5e17eb }
			});
		}

		const newTracks = tracks.reduce((a, b) => {
			if (a.indexOf(b) < 0) a.push(b);
			return a;
		}, []);

		await queue.store.cached.delete(queue.keys.next);
		await queue.add(...newTracks);

		const removed = tracks.length - newTracks.length;
		return message.util.send({
			embed: {
				author: {
					name: `Removed ${removed} Track${removed === 1 ? '' : 's'}`
				}, color: 0x5e17eb
			}
		});
	}
}

module.exports = ClearDuplicateCommand;
