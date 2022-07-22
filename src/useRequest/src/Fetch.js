class Fetch {

    pluginImpls = []
    state = []

    constructor(service, options, subscribe, initState) {
        this.service = service;
        this.options = options;
        this.subscribe = subscribe;
        if (initState) {
            this.state = initState;
        }
    }

    setState(partialState) {
        this.state = {
            ...this.state,
            ...partialState,
        };
        this.subscribe();
    }

    run() {
        const { onError } = this.options;
        this.runAsync().catch(err => {
            onError && onError(err);
        });
    }

    runAsync() {
        const { params } = this.state;
        let promise = this.service(...params);
        return promise;
    }

}

export default Fetch;