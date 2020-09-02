const { Command } = require('discord-akairo');
const fetch = require('node-fetch');

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
		const res = await this.getUser(name);
		const notFound = Object.entries(res);
		if (!notFound.length) {
			return message.util.send({
				embed: {
					color: 'RED',
					description: `No users found! with the name: **${name}**`
				}
			});
		}
		const account = res.graphql.user;
		const embed = this.client.util.embed()
			.setColor(0x5e17eb)
			.setTitle(account.full_name)
			.setURL(`https://instagram.com/${name}`)
			.setThumbnail(account.profile_pic_url_hd)
			.setDescription(`>>> ${account.biography}`)
			.addField('Username: ', `${account.username}`)
			.addField('Full name:', `${account.full_name}`)
			.addField('Posts:', `${account.edge_owner_to_timeline_media.count}`)
			.addField('Followers:', `${account.edge_followed_by.count}`)
			.addField('Following:', `${account.edge_follow.count}`)
			.addField('Account type:', account.is_private ? 'Private 🔐' : 'Public 🔓');
		return message.util.send(embed);
	}

	async getUser(name) {
		const url = `https://instagram.com/${name}/?__a=1`;

		const res = await fetch(url);
		const data = await res.json();
		return data;
	}
};
