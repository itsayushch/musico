const { Listener } = require('discord-akairo');
const { Message } = require('discord.js');

class NoInviteListener extends Listener {
	constructor() {
		super('noinvite', {
			emitter: 'client',
			event: 'message',
			category: 'client'
		});
	}

	/**
     * @param {Message} message - The message object
     */
	async exec(message) {
		if (message.guild.id !== '694554848758202451' || message.author.bot) return;
		if (message.member.permissions.has(['MANAGE_GUILD', 'MANAGE_MESSAGES'])) return;

		if (!/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/.test(message.content)) return null;

		const invites = await message.guild.fetchInvites();

		invites.map(m => m.toString()).includes(message.content);

		return message?.delete().catch(() => null);
	}
}

module.exports = NoInviteListener;
