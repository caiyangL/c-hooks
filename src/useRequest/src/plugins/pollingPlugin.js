import { useRef } from 'react';

import useUpdateEffect from '../../../useUpdateEffect';
import { isDocumentVisible } from '../../../utils/helper';
import subscribeReVisible from '../../../utils/subscribeReVisible';

function pollingPlugin(
	fetchInstance,
	{ pollingInterval = 0, pollingWhenHidden = true, pollingErrorRetryCount = -1 }
) {
	const countRef = useRef(0);
	const timerRef = useRef();
	const unSubscribeRef = useRef();
	const stopPolling = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}
		unSubscribeRef.current?.();
	};
	useUpdateEffect(() => {
		if (!pollingInterval) {
			stopPolling();
		}
	}, [pollingInterval]);

	if (!pollingInterval) return {};

	return {
		onBefore() {
			stopPolling();
		},
		onSuccess() {
			countRef.current = 0;
		},
		onFinally() {
			if (pollingErrorRetryCount === -1 || countRef.current <= pollingErrorRetryCount) {
				timerRef.current = setTimeout(() => {
					if (!pollingWhenHidden && !isDocumentVisible()) {
						unSubscribeRef.current = subscribeReVisible(() => {
							fetchInstance.refresh();
						});
					} else {
						fetchInstance.refresh();
					}
				}, pollingInterval);
				/* if (!pollingWhenHidden && !isDocumentVisible()) {
					unSubscribeRef.current = subscribeReVisible(() => {
						console.log('1')
						fetchInstance.refresh();
					});
				} else {
					timerRef.current = setTimeout(() => {
						fetchInstance.refresh();
					}, pollingInterval);
				} */
			} else {
				countRef.current = 0;
			}
		},
		onError() {
			countRef.current++;
		},
		onCancel() {
			stopPolling();
		},
	};
}

export default pollingPlugin;
