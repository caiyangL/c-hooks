let cache = new Map();

function getCache(key) {
	const cachedData = cache.get(key);
	if (cachedData != null) {
		const { timestamp, expireTime, params, data } = cachedData;
		const now = Date.now();
		if (expireTime === -1 || now - timestamp <= expireTime) {
			return { data, params, timestamp };
		}
		setCache(key, null);
		return null;
	}
	return null;
}

function setCache(key, params, data, expireTime) {
	const timestamp = Date.now();
	cache.set(key, {
		params,
		data,
		timestamp,
		expireTime,
	});
}

function clearCache(key) {
	if (key != null) {
		const keys = Array.isArray(key) ? key : [key];
		keys.forEach((k) => cache.delete(k));
        return;
	}
	cache.clear();
}

export default {
	getCache,
	setCache,
	clearCache,
};
