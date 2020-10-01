const { Command } = require('discord-akairo');
const instagram = require("user-instagram")

module.exports = class IGCommand extends Command {
	constructor() {
		super('instagram', {
			aliases: ['instagram', 'insta', 'ig'],
			category: 'utility',
			clientPermissions: ['SEND_MESSAGES'],
			args: [
				{
					id: 'name',
					type: 'string',
					match: 'content',
					prompt: {
						start: 'Enter your username'
					}
				}
			],
			description: {
				content: 'Searches your instagram profile',
				usage: '[username]',
				examples: ['ayushkr_04']
			}
		});
	}

	async exec(message, { name }) {
		try {
			const account = await this.getUser(name);
			const embed = this.client.util.embed()
				.setColor(11642864)
				.setTitle(account.username)
				.setURL(link)
				.setThumbnail(account.profilePicHD)
				.setDescription(`>>> ${account.biography}`)
				.addField('Username: ', `${account.username}`)
				.addField('Full name:', `${account.fullName}`)
				.addField('Posts:', `${account.postsCount}`)
				.addField('Followers:', `${account.subscribersCount}`)
				.addField('Following:', `${account.subscribtions}`)
				.addField('Account type:', account.isPrivate ? 'Private 🔐' : 'Public 🔓');
			return message.util.send(embed);
		} catch (e) {
			return message.util.send({
				embed: {
					color: 'RED',
					description: `No users found! with the name: **${name}**`
				}
			});
		}
	}

	async getUser(name) {
		const data = await instagram.getUserData(name);
		return data;
	}
};
