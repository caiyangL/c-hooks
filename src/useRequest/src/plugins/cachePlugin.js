import { useRef } from 'react';
import useUnMount from '../../../useUnMount';
import useCreation from '../../../useCreation';
import cache from '../../../utils/cache';
import cachePromise from '../../../utils/cachePromise';
import { subscribeCache, cacheTrigger } from '../../../utils/subscribeCache';

function cachePlugin(
	fetchInstance,
	{ cacheKey, cacheTime = 5 * 60 * 1000, staleTime = 0, setCache, getCache }
) {
	const unSubScribeRef = useRef();
	const currentPromiseRef = useRef();

	const _getCache = (key, params) => {
		if (getCache) {
			return getCache(params);
		}
		return cache.getCache(key);
	};

	const _setCache = (key, params, data) => {
		if (setCache) {
			setCache({ params, data });
		}
		cache.setCache(key, params, data, cacheTime);
		cacheTrigger(key, data);
	};

	const _subScribeCache = () => {
		unSubScribeRef.current = subscribeCache((key, data) => {
			if (key === cacheKey) {
				fetchInstance.setState({ data });
			}
		});
	};
	useCreation(() => {
		if (!cacheKey) return;

		const cachedData = _getCache(cacheKey);
		if (cachedData != null) {
			const { data, params } = cachedData;
			fetchInstance.state.data = data;
			fetchInstance.state.params = params;
		}

		_subScribeCache();
	}, []);
	useUnMount(() => {
		unSubScribeRef.current?.();
	});

	if (!cacheKey) return {};

	return {
		onBefore(params) {
			const cachedData = _getCache(cacheKey, params);
			if (cachedData != null) {
				const { data, timestamp } = cachedData;
				let result = { data };

				const now = Date.now();
				if (staleTime === -1 || now - timestamp <= staleTime) {
					result = {
						...result,
						returnNow: true,
						loading: false,
					};
				}

				return result;
			}
		},
		onRequest: (service, ...args) => {
			let servicePromise = cachePromise.getCache(cacheKey);

			if (!servicePromise || servicePromise === currentPromiseRef.current) {
				servicePromise = service(...args);
				cachePromise.setCache(cacheKey, servicePromise);
				currentPromiseRef.current = servicePromise;
			}

			return { servicePromise };
		},
		onSuccess(data, params) {
			unSubScribeRef.current?.();
			_setCache(cacheKey, params, data);
			_subScribeCache();
		},
		onMutate(data) {
			unSubScribeRef.current?.();
			_setCache(cacheKey, fetchInstance.state.params, data);
			_subScribeCache();
		},
	};
}

export default cachePlugin;
