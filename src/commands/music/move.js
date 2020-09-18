// const { Command, Argument } = require('discord-akairo');

// module.exports = class extends Command {
// 	constructor() {
// 		super('move', {
// 			aliases: ['move', 'mv'],
// 			category: 'music',
// 			description: {
// 				content: 'Moves a certain track to the first position in the queue or to a chosen position.',
// 				usage: '<start> <end>',
// 				examples: ['3', '5 6']
// 			},
// 			args: [
// 				{
// 					id: 'start',
// 					type: Argument.range('integer', 0, Infinity)
// 				},
// 				{
// 					id: 'end',
// 					type: Argument.range('integer', 0, Infinity)
// 				}
// 			]
// 		});
// 	}

// 	async exec(message, { start, end }) {
// 		if (!start || !end) return;

// 		const queue = this.client.music.queues.get(message.guild.id);
// 		const current = await queue.current();
// 		const tracks = await queue.tracks();
// 		let embed;
// 		if (!current || !tracks) {
// 			embed = {
// 				color: 11642864,
// 				description: 'There is nothing in the queue'
// 			};
// 		} else if (current && tracks) {
// 			await queue.move(start, end);
// 			embed = {
// 				color: 11642864,
// 				description: 'Succesfully moved the tracks'
// 			};
// 		} else {
// 			return message.util.send({
// 				embed: {
// 					color: 11642864,
// 					description: 'Couldn\'t move the tracks'
// 				}
// 			});
// 		}

// 		return message.util.send({ embed });
// 	}
// };

