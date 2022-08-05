import { useRef, useEffect } from 'react';
import { debounce } from 'lodash';

import useCreation from '../../../useCreation';

function debouncePlugin(
	fetchInstance,
	{ debounceWait, debounceLeading, debounceTrailing, debounceMaxWait }
) {
	const debouncedRef = useRef();

	const options = useCreation(() => {
		const o = {};
		if (debounceLeading != null) {
			o.leading = debounceLeading;
		}
		if (debounceTrailing != null) {
			o.trailing = debounceTrailing;
		}
		if (debounceMaxWait != null) {
			o.maxWait = debounceMaxWait;
		}
	}, [debounceLeading, debounceTrailing, debounceMaxWait]);

	useEffect(() => {
		if (debounceWait != null) {
			const originRunAsync = fetchInstance.runAsync.bind(fetchInstance);

			debouncedRef.current = debounce(
				(callback) => {
					callback?.();
				},
				debounceWait,
				options
			);

			fetchInstance.runAsync = function (...args) {
				return new Promise((resolve, reject) => {
					debouncedRef.current(() => {
						originRunAsync(...args)
							.then(resolve)
							.catch(reject);
					});
				});
			};

			return () => {
				fetchInstance.runAsync = originRunAsync;
				debouncedRef.current?.cancel();
			};
		}
	}, [debounceWait, options]);

	if (debounceWait == null) return {};
	return {
		onCancel() {
			debouncedRef.current?.cancel();
		},
	};
}

export default debouncePlugin;
