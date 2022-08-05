import { useRef, useEffect } from 'react';
import { throttle } from 'lodash';
import useCreation from '../../../useCreation';

function throttlePlugin(fetchInstance, { throttleWait, throttleLeading, throttleTrailing }) {
	const throttledRef = useRef();

	const options = useCreation(() => {
		const o = {};
		if (throttleLeading != null) {
			o.leading = throttleLeading;
		}
		if (throttleTrailing != null) {
			o.trailing = throttleTrailing;
		}
		return o;
	}, [throttleLeading, throttleTrailing]);

	useEffect(() => {
		if (throttleWait != null) {
			const originRunAsync = fetchInstance.runAsync.bind(fetchInstance);

			throttledRef.current = throttle(
				(callback) => {
					callback?.();
				},
				throttleWait,
				options
			);

			fetchInstance.runAsync = function (...args) {
				return new Promise((resolve, reject) => {
					throttledRef.current(() => {
						console.log('enter');
						originRunAsync(...args)
							.then(resolve)
							.catch(reject);
					});
				});
			};

			return () => {
				fetchInstance.runAsync = originRunAsync;
				throttledRef.current?.cancel();
			};
		}
	}, [throttleWait, options]);

	if (throttleWait == null) return {};
	return {
		onCancel() {
			cancelRef.current?.cancel();
		},
	};
}

export default throttlePlugin;
