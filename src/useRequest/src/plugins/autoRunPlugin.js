import useUpdateEffect from '../../../useUpdateEffect';

function autoRunPlugin(
	fetchInstance,
	{ manual = false, ready = true, defaultParams = [], refreshDeps = [], refreshAction }
) {
	let hasAutoRun = false;

	useUpdateEffect(() => {
		if (!manual && ready) {
			hasAutoRun = true;
			fetchInstance.run(...defaultParams);
		}
	}, [ready]);

	useUpdateEffect(() => {
		if (hasAutoRun) return;
		if (!manual) {
			if (refreshAction) {
				refreshAction();
			} else {
				fetchInstance.refresh();
			}
		}
	}, [...refreshDeps]);

	return {
		onBefore() {
			if (!ready) {
				return {
					stopNow: true,
				};
			}
		},
	};
}

autoRunPlugin.onInit = function ({ manual, ready }) {
	return {
		loading: !manual && ready,
	};
};

export default autoRunPlugin;
