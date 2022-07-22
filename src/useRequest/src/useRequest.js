import useRequestImpl from "./useRequestImpl";
import loggerPlugin from './plugins/loggerPlugin';

function useRequest(service, options, plugins=[]) {
	return useRequestImpl(
		service,
		options,
		[
			...plugins,
			loggerPlugin,
		]
	);
}

export default useRequest;
