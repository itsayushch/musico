const { Util } = require('discord.js');

module.exports = class PlaylistHandler {
	constructor(client) {
		this.client = client;
	}

	// 	For creating a playlist
	async create(message, name, info) {
		const pl = await this.client.mongo.db('musico').collection('playlist')
			.insertOne({
				name,
				guild: message.guild.id,
				user: message.author.id,
				description: info ? info : null,
				plays: 0,
				createdAt: new Date(),
				tracks: []
			});
		return pl;
	}

	// 	For adding a track to the playlist
	async add(message, name, track) {
		const pladd = await this.client.mongo.db('musico').collection('playlist')
			.updateOne({
				name,
				guild: message.guild.id,
				user: message.author.id
			},
			{ $push: { tracks: { $each: track } } },
			{ upsert: true });
		return pladd;
	}

	// 	For editing the playlist plays
	async plays(name, plays) {
		const plplays = await this.client.mongo.db('musico').collection('playlist')
			.updateOne({
				name
			},
			{ $set: { plays } },
			{ upsert: true });
		return plplays;
	}

	// 	For editing the playlist's description
	async editdesc(name, description) {
		const pledit = await this.client.mongo.db('musico').collection('playlist')
			.updateOne({
				name
			},
			{ $set: { description } },
			{ upsert: true });
		return pledit;
	}

	// 	For editing the playlist's name
	async editname(name, newname) {
		const pledit = await this.client.mongo.db('musico').collection('playlist')
			.updateOne({ name }, {
				$set: {
					name: newname
				}
			},
			{ upsert: true });
		return pledit;
	}

	// 	For deleting the playlist
	async remove(name) {
		const pldel = await this.client.mongo.db('musico').collection('playlist')
			.findOneAndDelete({ name });
		return pldel;
	}

	// 	For removing a song from the playlist
	async removesong(name, track) {
		const plrm = await this.client.mongo.db('musico').collection('playlist')
			.updateOne({
				name
			},
			{ $set: { tracks: track } },
			{ upsert: true });
		return plrm;
	}
};
