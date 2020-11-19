const lavalink = require('lavalink');
const events = require('events');

class Queue extends events.EventEmitter {
	constructor(store, guild) {
		super();
		this.store = store;
		this.guild = guild;
		this.keys = {
			next: `${this.guild}.next`,
			pos: `${this.guild}.pos`,
			prev: `${this.guild}.prev`,
			loop: `${this.guild}.loop`
		};

		this.on('event', async d => {
			if (!['TrackEndEvent', 'TrackStartEvent'].includes(d.type) || (d.type === 'TrackEndEvent' && !['REPLACED', 'STOPPED'].includes(d.reason))) {
				const count = d.type === 'TrackEndEvent' ? undefined : 1;
				this._previous(this._store.get(this.keys.prev));
				try {
					this._next({ count, previous: d });
				} catch (error) {
					this.store.client.emit('error', error);
				}
			}
		});

		this.on('playerUpdate', async d => {
			try {
				this._store.set(this.keys.pos, d.state.position);
			} catch (e) {
				this.store.client.emit('error', e);
			}
		});
	}

	get player() {
		return this.store.client.players.get(this.guild);
	}

	async start() {
		const np = this.current();
		if (!np) return this._next();
		await this.player.play(np.track, { start: np.position });
		return true;
	}

	add(...tracks) {
		if (!tracks.length) return Promise.resolve(0);
		const oldTracks = this._store.get(this.keys.next) || [];
		oldTracks.push(...tracks);
		return this._store.set(this.keys.next, oldTracks);
	}

	unshift(...tracks) {
		if (!tracks.length) return Promise.resolve(0);
		const oldTracks = this._store.get(this.keys.next) || [];
		oldTracks.unshift(...tracks);
		return this._store.set(this.keys.next, oldTracks);
	}

	remove(track) {
		const tracks = this._store.get(this.keys.next) || [];
		if (tracks.includes(track)) {
			const index = tracks.indexOf(track);
			tracks.splice(index, 1);
			this._store.set(this.keys.next, tracks);

			return true;
		}
		return false;
	}

	next(count = 1) {
		return this._next({ count });
	}

	length() {
		const tracks = this._store.get(this.keys.next);
		return tracks ? tracks.length : 0;
	}

	sort(predicate) {
		const tracks = this.tracks();
		tracks.sort(predicate);
		return this._store.set(this.keys.next, [...tracks]);
	}

	move(from, to) {
		const tracks = this._store.get(this.keys.next) || [];
		from = from >= 1 ? from - 1 : tracks.length - (~from + 1);
		to = to >= 1 ? to - 1 : tracks.length - (~to + 1);

		const element = tracks[from];
		tracks.splice(from, 1);
		tracks.splice(to, 0, element);

		this._store.set(this.keys.next, tracks);
		return tracks;
	}

	shuffle() {
		const tracks = this._store.get(this.keys.next) || [];
		const shuffled = tracks.map(track => ({ sort: Math.random(), track }))
			.sort((a, b) => a.sort - b.sort)
			.map(a => a.track);
		return this._store.set(this.keys.next, shuffled);
	}

	looping(boolean) {
		if (boolean === undefined) return this._store.get(this.keys.loop);
		this._store.set(this.keys.loop, boolean);
		return this._store.get(this.keys.loop);
	}

	splice(start, deleteCount, ...arr) {
		const tracks = this._store.get(this.keys.next) || [];
		tracks.splice(start, deleteCount, ...arr);
		return this._store.set(this.keys.next, tracks);
	}

	trim(start, end) {
		const tracks = this._store.get(this.keys.next) || [];
		const trimmed = tracks.slice(start, end);
		return this._store.set(this.keys.next, trimmed);
	}

	async stop() {
		await this.player.stop();
	}

	clear() {
		this._store.delete(this.keys.pos);
		this._store.delete(this.keys.prev);
		this._store.delete(this.keys.next);
		this._store.delete(this.keys.loop);
		return true;
	}

	current() {
		const [track, position] = [this._store.get(this.keys.prev), this._store.get(this.keys.pos)];
		if (track) {
			return {
				track,
				position: Math.floor(position) || 0
			};
		}
		return null;
	}

	previous(track) {
		return this._previous;
	}

	_previous(track) {
		let tracks = undefined;
		if (track) tracks = track;
		return tracks;
	}

	async tracks() {
		const tracks = this._store.get(this.keys.next);
		return tracks || [];
	}

	_next({ count, previous } = {}) {
		this._store.set(this.keys.pos, 0);
		if (!previous) previous = this.current();
		if (count === undefined && previous) {
			const length = this.length();
			count = this.store.client.advanceBy(this, { previous: previous.track, remaining: length });
		}
		if (count === 0) return this.start();
		const skipped = this._replace(count);
		if (skipped.length) return this.start();
		this.clear();
		return false;
	}

	_replace(count = 1) {
		const tracks = this._store.get(this.keys.next) || [];
		if (count > tracks.length || count < -tracks.length) return [];
		count = count >= 1 ? count - 1 : tracks.length - (~count + 1);
		this._store.set(this.keys.prev, tracks[count]);
		const skipped = tracks.slice(count + 1, tracks.length);
		this._store.set(this.keys.next, skipped);
		return { length: skipped.length + 1 };
	}

	get _store() {
		return this.store.cached;
	}
}

class QueueStore extends Map {
	constructor(client) {
		super();
		this.client = client;
		this.cached = new Map();
	}

	get(key) {
		let queue = super.get(key);
		if (!queue) {
			queue = new Queue(this, key);
			this.set(key, queue);
		}
		return queue;
	}
}

class QueueNode extends lavalink.Node {
	constructor(options) {
		if (!options.hosts) throw new Error('cannot make a queue without a lavalink connection');
		super(options);
		this.queues = new QueueStore(this);
		this.advanceBy = options.advanceBy || (() => 1);
		for (const name of ['event', 'playerUpdate']) {
			this.on(name, d => {
				this.queues.get(d.guildId).emit(name, d);
			});
		}
	}
}

module.exports = QueueNode;
