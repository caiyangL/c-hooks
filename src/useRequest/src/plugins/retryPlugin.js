import { useRef } from 'react';

function retryPlugin(fetchInstance, { retryCount, retryInterval }) {
	const countRef = useRef(0);
	const timerRef = useRef();
	const triggerByRetryRef = useRef(false);

	if (!retryCount) return {};

	return {
		onBefore() {
			if (!triggerByRetryRef.current) {
				countRef.current = 0;
			}
			triggerByRetryRef.current = false;

			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		},
		onSuccess() {
			countRef.current = 0;
		},
		onError() {
			countRef.current++;
			const timeout = retryInterval ?? Math.min(2 ** countRef.current * 1000, 30 * 1000);
			if (retryCount === -1 || countRef.current <= retryCount) {
				timerRef.current = setTimeout(() => {
					triggerByRetryRef.current = true;
					fetchInstance.refresh();
				}, timeout);
			} else {
				countRef.current = 0;
			}
		},
		onCancel() {
			countRef.current = 0;
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		},
	};
}

export default retryPlugin;
