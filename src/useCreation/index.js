import { useRef } from 'react';

import { depsAreSame } from '../utils/helper';


function useCreation(factory, deps) {
    const { current } = useRef({
        deps: undefined,
        obj: undefined,
        initialized: false,
    });

    if (!current.initialized || !depsAreSame(current.deps, deps)) {
        current.obj = factory();
        current.deps = deps;
        current.initialized = true;
    }

    return current.obj;
}

export default useCreation;