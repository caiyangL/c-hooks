import { useRef } from 'react';

function loadingDelayPlugin(fetchInstance, { loadingDelay }) {
    if (!loadingDelay) return {};

	const timerRef = useRef();
	const clearTimer = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}
	};

	return {
		onBefore() {
			clearTimer();

			timerRef.current = setTimeout(() => {
				fetchInstance.setState({ loading: true });
			}, loadingDelay);

			return {
				loading: false,
			};
		},
		onFinally() {
			clearTimer();
		},
		onCancel() {
			clearTimer();
		},
	};
}

export default loadingDelayPlugin;
