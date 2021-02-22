const lavalink = require('lavalink');
const events = require('events');
const fetch = require('node-fetch');

class Queue extends events.EventEmitter {
	/**
	 * @param {QueueStore} store - The queue store.
	 * @param {string} guild - The guild ID.
	 */
	constructor(store, guild) {
		super();
		this.store = store;
		this.guild = guild;
		this.spotifyPattern = /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+).*$/;
		this.baseURL = 'https://api.spotify.com/v1';
		this.token = '';
		this.keys = {
			next: `${this.guild}.next`,
			pos: `${this.guild}.pos`,
			prev: `${this.guild}.prev`,
			loop: `${this.guild}.loop`
		};

		this.on('event', async d => {
			if (!['TrackEndEvent', 'TrackStartEvent'].includes(d.type) || (d.type === 'TrackEndEvent' && !['REPLACED', 'STOPPED'].includes(d.reason))) {
				const count = d.type === 'TrackEndEvent' ? undefined : 1;
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

	async load(track) {
		const [check, type, id] = this.spotifyPattern.exec(track) ?? [];

		if (!check) return this.store.client.load(track);

		let loadData;

		switch (type) {
			case 'album':
				loadData = await this.getAlbum(id);
				break;
			case 'playlist':
				loadData = await this.getPlaylist(id);
				break;
			case 'track':
				loadData = await this.getTrack(id);
				break;
			default:
				break;
		}

		return loadData;
	}

	async requestToken() {
		if (this.nextRequest) return;
		try {
			const res = await fetch('https://accounts.spotify.com/api/token', {
				method: 'POST',
				headers: {
					Authorization: `Basic ${Buffer.from(`${this.store.client.options.spotifyClientID}:${this.store.client.options.spotifyClientSecret}`).toString('base64')}`,
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: 'grant_type=client_credentials'
			});

			const { access_token, token_type, expires_in } = await res?.json();
			this.token = `${token_type} ${access_token}`;
			this.nextRequest = setTimeout(() => {
				delete this.nextRequest;
				void this.requestToken();
			}, expires_in * 1000);
		} catch (e) {
			if (e.status === 400) {
				return Promise.reject(new Error('Invalid Spotify client.'));
			}
			await this.requestToken();
		}
	}

	async getTrack(id) {
		const res = await fetch(`${this.baseURL}/tracks/${id}`, {
			method: 'GET',
			headers: {
				Authorization: this.token,
				'Content-Type': 'application/json'
			}
		});

		const track = await res?.json();
		const lavaTrack = track && await this.resolve(track);

		return {
			loadType: lavaTrack ? 'TRACK_LOADED' : 'NO_MATCHES',
			playlistInfo: {},
			tracks: lavaTrack ? [lavaTrack] : []
		};
	}

	async getAlbum(id) {
		const res = await fetch(`${this.baseURL}/albums/${id}`, {
			method: 'GET',
			headers: {
				Authorization: this.token,
				'Content-Type': 'application/json'
			}
		});

		const album = await res?.json();

		return {
			loadType: album ? 'PLAYLIST_LOADED' : 'NO_MATCHES',
			playlistInfo: {
				name: album === null || album === void 0 ? void 0 : album.name
			},
			tracks: album
				? (await Promise.all(album.tracks.items.map(x => this.resolve(x)))).filter(Boolean)
				: []
		};
	}

	async getPlaylist(id) {
		const res = await fetch(`${this.baseURL}/playlists/${id}`, {
			method: 'GET',
			headers: {
				Authorization: this.token,
				'Content-Type': 'application/json'
			}
		});

		const playlist = await res?.json();


		const playlistTracks = playlist ? await this.getPlaylistTracks(playlist) : [];
		return {
			loadType: playlist ? 'PLAYLIST_LOADED' : 'NO_MATCHES',
			playlistInfo: {
				name: playlist === null || playlist === void 0 ? void 0 : playlist.name
			},
			tracks: (await Promise.all(playlistTracks.map(x => this.resolve(x.track)))).filter(Boolean)
		};
	}

	async getPlaylistTracks(playlist, currPage = 1) {
		if (!playlist.tracks.next || currPage >= this.playlistPageLoadLimit) { return playlist.tracks.items; }
		currPage++;

		const res = await fetch(playlist.tracks.next, {
			method: 'GET',
			headers: {
				Authorization: this.token,
				'Content-Type': 'application/json'
			}
		});

		const { items, next } = await res?.json();

		const mergedPlaylistTracks = playlist.tracks.items.concat(items);
		if (next && currPage < this.playlistPageLoadLimit) {
			return this.getPlaylistTracks({
				tracks: {
					items: mergedPlaylistTracks,
					next
				}
			}, currPage);
		}
		return mergedPlaylistTracks;
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

	async tracks() {
		const tracks = this._store.get(this.keys.next);
		return tracks || [];
	}

	async resolve(track) {
		try {
			const params = new URLSearchParams({
				identifier: `ytsearch:${track.artists[0].name} - ${track.name} ${this.client.options.filterAudioOnlyResult ? 'description:("Auto-generated by YouTube.")' : ''}`
			}).toString();

			const res = await fetch(`${this.store.client.options.hosts.rest}/loadtracks?${params}`, {
				method: 'GET',
				headers: {
					Authorization: this.store.client.options.password
				}
			});

			const body = await res?.json();

			return body.tracks[0];
		} catch (_a) {
			return undefined;
		}
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
	/**
	 * @param {QueueNode} client - The Node
	 */
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
		this.options = options;
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
