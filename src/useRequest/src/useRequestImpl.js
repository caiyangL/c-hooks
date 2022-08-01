import Fetch from './Fetch';
import useCreation from '../../useCreation';
import useUpdate from '../../useUpdate';
import useMount from '../../useMount';
import useMemoizedFn from '../../useMemoizedFn';
import useLatest from '../../useLatest';

function useRequestImpl(service, options = {}, plugins = []) {
	const { manual = false, ...rest } = options;
	const fetchOptions = {
		manual,
		...rest,
	};
	const serviceRef = useLatest(service);

	const update = useUpdate();
	const fetchInstance = useCreation(() => {
		const initState = plugins.map((plugin) => plugin.onInit?.(fetchOptions)).filter(Boolean);
		return new Fetch(serviceRef, fetchOptions, update, Object.assign({}, ...initState));
	}, []);

	// 保证每次调用都能更新
	fetchInstance.options = fetchOptions;
	fetchInstance.pluginImpls = plugins.map((plugin) => plugin(fetchInstance, fetchOptions));

	useMount(() => {
		if (!manual) {
			const params = fetchInstance.state.params || fetchOptions.defaultParams || [];
			fetchInstance.run(...params);
		}
	});

	return {
		data: fetchInstance.state.data,
		loading: fetchInstance.state.loading,
		error: fetchInstance.state.error,
		run: useMemoizedFn(fetchInstance.run.bind(fetchInstance)),
		runAsync: useMemoizedFn(fetchInstance.runAsync.bind(fetchInstance)),
		refresh: useMemoizedFn(fetchInstance.refresh.bind(fetchInstance)),
		refreshAsync: useMemoizedFn(fetchInstance.refreshAsync.bind(fetchInstance)),
		mutate: useMemoizedFn(fetchInstance.mutate.bind(fetchInstance)),
		cancel: useMemoizedFn(fetchInstance.cancel.bind(fetchInstance)),
	};
}

export default useRequestImpl;
