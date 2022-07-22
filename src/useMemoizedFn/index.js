import { useRef, useMemo } from 'react';

function useMemoizedFn(fn) {
    const fnRef = useRef();
    fnRef.current = useMemo(() => fn, [fn]);

    const memoizedRef = useRef();
    if (!memoizedRef.current) {
        memoizedRef.current = function(...args) {
            return fnRef.current.apply(this, args);
        }
    }

    return memoizedRef.current;
}

export default useMemoizedFn;