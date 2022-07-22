import Fetch from "./Fetch";
import useCreation from '../../useCreation';
import useUpdate from '../../useUpdate';

function useRequestImpl(service, options={}, plugins=[]) {
    const { manual = false, ...rest } = options;
    const fetchOptions = {
        manual,
        ...rest,
    };

    const update = useUpdate();
    const fetchInstance = useCreation(() => {
        const initState = plugins.map(plugin => plugin?.onInit(fetchOptions)).filter(Boolean);
        return new Fetch(
            service,
            fetchOptions,
            update,
            initState,
        )
    }, []);

    

    return {
        data: fetchInstance.state.data,
        loading: fetchInstance.state.loading,
        error: fetchInstance.state.error,
    };
}

export default useRequestImpl;