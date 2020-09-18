const { Command } = require('discord-akairo');
const supportServer = 'https://discord.gg/sY57ftY';

class InviteCommand extends Command {
	constructor() {
		super('invite', {
			aliases: ['invite'],
			category: 'general',
			clientPermissions: ['SEND_MESSAGES'],
			args: [
				{
					id: 'here',
					match: 'flag',
					flag: '--here'
				},
				{
					id: 'member',
					type: 'user'
				}
			],
			description: {
				content: 'Send invite link for the bot and support server\nCan also show the invite for other bot if you mention him',
				usage: '',
				examples: ['']
			}
		});
	}

	async exec(message, args) {
		if (args.member) {
			if (args.member.bot) {
				return message.channel.send(`You can add the bot you mentioned with this link: https://discordapp.com/oauth2/authorize?client_id=${args.member.id}&scope=bot&permissions=8\n\`Note: The invite might not work if the bot is not public\``);
			}
			return message.channel.send('Sorry, the user you mentioned is not a bot!');
		}
		const invMessage = 'https://discord.com/oauth2/authorize?client_id=629283787095932938&permissions=305482819&scope=bot';
		if (args.here) {
			const embed = this.client.util.embed()
				.setColor(11642864)
				.setAuthor(this.client.user.username)
				.setDescription([
					`**[Invite Me](${invMessage})**`,
					`**[Official Discord](${supportServer})**`
				])
				.setFooter(`© ${new Date().getFullYear()} ${this.owner.username}`, this.owner.displayAvatarURL());
			return message.util.send({ embed });
		}
		message.channel.send('Check your dm');
		const embed = this.client.util.embed()
			.setColor(11642864)
			.setAuthor(this.client.user.username)
			.setDescription([
				`**[Invite Me](${invMessage}) **`,
				`**[Official Discord](${supportServer})**`
			])
			.setFooter(`© ${new Date().getFullYear()} ${this.owner.username}`, this.owner.displayAvatarURL());
		message.author.send({ embed });
	}

	get owner() {
		return this.client.users.cache.get(this.client.ownerID[0]);
	}
}

module.exports = InviteCommand;
