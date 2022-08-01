const cache = new Map();

const setCache = (key, promise) => {
	cache.set(key, promise);
	const remove = () => {
		cache.delete(key);
	};
	promise.then(remove).catch(remove);
};

const getCache = (key) => {
	return cache.get(key);
};

export default { setCache, getCache };
