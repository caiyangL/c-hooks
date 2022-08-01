import useRequestImpl from './useRequestImpl';
import loadingDelayPlugin from './plugins/loadingDelayPlugin';
import pollingPlugin from './plugins/pollingPlugin';
import autoRunPlugin from './plugins/autoRunPlugin';
import refreshOnWindowFocusPlugin from './plugins/refreshOnWindowFocusPlugin';
import cachePlugin from './plugins/cachePlugin';

function useRequest(service, options, plugins = []) {
	return useRequestImpl(service, options, [
		...plugins,
		loadingDelayPlugin,
		pollingPlugin,
		autoRunPlugin,
		refreshOnWindowFocusPlugin,
		cachePlugin,
	]);
}

export default useRequest;
