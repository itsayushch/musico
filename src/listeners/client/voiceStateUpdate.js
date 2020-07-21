const { Listener } = require('discord-akairo');

class VoiceStateUpdateListener extends Listener {
	constructor() {
		super('voiceStateUpdate', {
			event: 'voiceStateUpdate',
			emitter: 'client',
			category: 'client'
		});

		this.timeout = new Map();
	}

	async exec(oldState, newState) {
		if (newState.guild.me.voice.channel && oldState.guild.me.voice.channel) {
			const queue = this.client.music.queues.get(newState.guild.id);
			if (!await queue.current() || newState.guild.me.voice.channel.members.size <= 1) {
				this.leave(queue);
			} if (newState.guild.me.voice.channel.members.size >= 2) {
				this.cancel(queue);
			}
		}
	}

	leave(queue) {
		const timeout = setTimeout(async () => {
			await queue.player.stop();
			await queue.player.destroy();
			await queue.player.leave();
			this.timeout.delete(queue.guildID);
		}, 1000 * 60 * 2);
		this.timeout.set(queue.guildID, timeout);
	}

	cancel(queue) {
		clearTimeout(this.timeout.get(queue.guildID));
		this.timeout.delete(queue.guildID);
	}
}

module.exports = VoiceStateUpdateListener;
