import createSubscribe from './createSubscribe';

const { subscribe: subscribeCache, trigger: cacheTrigger } = createSubscribe();

export { subscribeCache, cacheTrigger };
