import { useState } from 'react';

import useMemoizedFn from '../useMemoizedFn';

function useUpdate() {
	const [, setState] = useState({});
	const update = () => setState({});
	return useMemoizedFn(update);
}

export default useUpdate;
