const { Command, Argument } = require('discord-akairo');
const moment = require('moment');
require('moment-duration-format');

class UserInfoCommand extends Command {
	constructor() {
		super('userInfo', {
			aliases: ['userInfo', 'user'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			channel: 'guild',
			args: [
				{
					id: 'user',
					type: Argument.union('user', (_, id) => id ? this.client.users.fetch(id).catch(() => null) : null),
					default: message => message.author
				}
			],
			description: {
				content: 'Show info about a user',
				usage: '[@user]',
				examples: ['@SomeoneReallyCoolInMyGuild']
			}
		});
	}

	async exec(message, { user }) {
		const member = message.guild.member(user);

		const Embed = this.client.util.embed()
			.setColor(member ? member.displayHexColor : 11642864)
			.setThumbnail(user.displayAvatarURL())
			.setAuthor(`${user.tag}`, user.displayAvatarURL())
			.addField('Current rank hex color', member ? member.displayHexColor : 'Not in this guild', false)
			.addField('ID', user.id)
			.addField('Joined guild at', member ? `${moment(member.joinedAt).format('DD-MM-YYYY')}\n(${moment.duration(new Date() - member.joinedAt).format('YY [years] MM [months] DD [days] [ago]')})` : 'Not in this guild', false)
			.addField('Date when account created', `${moment(user.createdAt).format('DD-MM-YYYY')}\n(${moment.duration(new Date() - user.createdAt).format('YY [years] MM [months] DD [days] [ago]')})`, false)
			.setTimestamp();


		// Show since when this user have been boosting the current guild
		if (member && member.premiumSince) Embed.addField('Boosting this guild since', moment(member.premiumSince).format('DD-MM-YYYY'), false);

		// Show user status
		if (user.presence.activities[0]) {
			Embed.addField('Presence', user.presence.activities[0], false);
			if (user.presence.activities[0].details) Embed.addField('\u200b', user.presence.activities[0].details, false);
			if (user.presence.activities[0].state) Embed.addField('​\u200b', user.presence.activities[0].state, false);
		}
		Embed.addField('Account type', user.bot ? 'Bot' : 'Human', false);
		// Show guild nickname
		if (member && member.nickname) Embed.addField('Nickname', member.nickname, false);
		// Show user locale ( i have no idea What it is ) https://discord.js.org/#/docs/main/master/class/User?scrollTo=locale
		if (user.locale) Embed.addField('Locale settings', user.locale, false);

		// Show on which platform they are using discord from if its not a bot
		if (user.presence.clientStatus && !user.bot) {
			if (user.presence.clientStatus.mobile) Embed.addField('Using discord on', `📱 ${user.presence.clientStatus.mobile}`, false);
			if (user.presence.clientStatus.desktop) Embed.addField('Using discord on', `💻 ${user.presence.clientStatus.desktop}`, false);
			if (user.presence.clientStatus.web) Embed.addField('Using discord on', `☁️ ${user.presence.clientStatus.web}`, false);
		}

		return message.channel.send({ embed: Embed });
	}
}

module.exports = UserInfoCommand;

