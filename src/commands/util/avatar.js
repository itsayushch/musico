const { Command, Argument } = require('discord-akairo');

class AvatarCommand extends Command {
	constructor() {
		super('avatar', {
			aliases: ['avatar', 'av'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
			args: [
				{
					id: 'user',
					type: Argument.union('user', (_, id) => id ? this.client.users.fetch(id).catch(() => null) : null),
					default: message => message.author
				}
			],
			description: {
				content: 'Show avatar of the mentioned user or you',
				usage: '(optional) [@user]',
				examples: ['', '@user', 'username']
			}
		});
	}

	async exec(message, { user }) {
		const avatarEmbed = this.client.util.embed()
			.setColor(message.member ? message.member.displayHexColor : 11642864)
			.setTitle('Avatar');

		const format = user.displayAvatarURL({ dynamic: true }).substr(user.displayAvatarURL({ dynamic: true }).length - 3);
		if (format === 'gif') {
			avatarEmbed.setAuthor(`${user.username}#${user.discriminator} (${user.id})`);
			avatarEmbed.setDescription(`[gif](${user.displayAvatarURL({ format: 'gif', size: 2048 })})`);
			avatarEmbed.setImage(user.displayAvatarURL({ format: 'gif', size: 2048 }));
		} else {
			avatarEmbed.setAuthor(`${user.username}#${user.discriminator} (${user.id})`);
			avatarEmbed.setDescription(`[png](${user.displayAvatarURL({ format: 'png', size: 2048 })}) | [jpeg](${user.displayAvatarURL({ format: 'jpg', size: 2048 })}) | [webp](${user.displayAvatarURL({ format: 'webp', size: 2048 })})`);
			avatarEmbed.setImage(user.displayAvatarURL({ format: 'png', size: 2048 }));
		}
		return message.channel.send({ embed: avatarEmbed });
	}
}

module.exports = AvatarCommand;
