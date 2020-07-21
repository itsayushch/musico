const { MongoClient } = require('mongodb');

class MongoDB extends MongoClient {
	constructor() {
		super(process.env.MONGO, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
	}
}

module.exports = MongoDB;
