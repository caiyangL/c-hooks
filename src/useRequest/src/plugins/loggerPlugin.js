function loggerPlugin(fetchInstance) {
    return {
        onRequest(service, params) {
            console.log(`[logger] request params:${params}`);
        }
    }
}

export default loggerPlugin;