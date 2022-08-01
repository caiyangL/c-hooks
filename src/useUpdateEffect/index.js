import { useRef, useEffect } from 'react';

function useUpdateEffect(effect, deps) {
	const mounted = useRef(false);

    // react-refresh 热更新时，会重新remount，但不会重置ref的值。 
	useEffect(() => {
		return () => {
			mounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (!mounted.current) {
			mounted.current = true;
		} else {
			return effect();
		}
	}, deps);
}

export default useUpdateEffect;
