import { useEffect } from 'react';

import { limit } from '../../../utils/helper';
import subscribeFocus from '../../../utils/subscripbeFocus';

function refreshOnWindowFocusPlugin(
	fetchInstance,
	{ refreshOnWindowFocus = false, focusTimespan = 5000 }
) {
	useEffect(() => {
		if (refreshOnWindowFocus) {
			const limitRefresh = limit(fetchInstance.refresh.bind(fetchInstance), focusTimespan);
			const unSubscribe = subscribeFocus(() => {
				limitRefresh();
			});
			return () => {
				unSubscribe();
			};
		}
	}, [refreshOnWindowFocus, focusTimespan]);

	return {};
}

export default refreshOnWindowFocusPlugin;
