import { useEffect } from 'react';

function useUnMount(effect) {
	useEffect(() => {
		return () => {
			effect?.();
		};
	}, []);
}

export default useUnMount;
