const { Provider } = require('discord-akairo');

class MongoDBProvider extends Provider {
	constructor(database) {
		super();
		this.database = database;
	}

	async init() {
		return this.database.find().toArray()
			.then(data => {
				data.forEach(data => {
					this.items.set(data.id, data);
				});
			});
	}

	get(id, key, defaultValue) {
		if (this.items.has(id)) {
			const value = this.items.get(id)[key];
			return value == null ? defaultValue : value;
		}

		return defaultValue;
	}


	set(id, key, value) {
		const data = this.items.get(id) || {};
		data[key] = value;
		this.items.set(id, data);

		return this.database.updateOne(
			{ id },
			{ $set: { [key]: value } },
			{ upsert: true }
		);
	}

	delete(id, key) {
		const data = this.items.get(id) || {};
		delete data[key];

		return this.database.updateOne({ id }, {
			$unset: { [key]: '' }
		}, { upsert: true });
	}

	clear(id) {
		this.items.delete(id);

		return this.database.deleteOne({ id });
	}
}

module.exports = MongoDBProvider;
