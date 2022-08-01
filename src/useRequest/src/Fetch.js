import { isFunction } from '../../utils/helper';

class Fetch {
	pluginImpls = []; // 插件

	count = 0; // 用于取消请求

	state = {
		data: undefined,
		loading: false,
		error: undefined,
		params: undefined,
	};

	constructor(serviceRef, options, subscribe, initState = {}) {
		this.serviceRef = serviceRef;
		this.options = options;
		this.subscribe = subscribe;
		this.state = {
			...this.state,
			loading: !options.manual, // 可优化第一次不必要的loading更新引起的组件更新
			...initState,
		};
	}

	setState(partialState) {
		this.state = {
			...this.state,
			...partialState,
		};
		this.subscribe();
	}

	async runAsync(...params) {
		this.count++;
		const currentCount = this.count;

		const { stopNow, returnNow, ...state } = this.runPluginHandler('onBefore', params);

		if (stopNow) {
			return new Promise(() => {});
		}

		this.setState({
			loading: true,
			params,
			...state,
		});

		if (returnNow) {
			return state.data;
		}

		this.options.onBefore?.(params);

		try {
			let { servicePromise } = this.runPluginHandler('onRequest', this.serviceRef.current, params);
			if (!servicePromise) {
				servicePromise = this.serviceRef.current?.(...params);
			}
			const res = await servicePromise;

			if (currentCount !== this.count) {
				return new Promise(() => {});
			}

			this.options.onSuccess?.(res, params);
			this.runPluginHandler('onSuccess', res, params);

			this.options.onFinally?.(params, res, undefined);
			this.runPluginHandler('onFinally', params, res, undefined);

			this.setState({
				data: res,
				loading: false,
				error: undefined,
			});

			return res;
		} catch (err) {
			if (currentCount !== this.count) {
				return new Promise(() => {});
			}

			this.options.onError?.(err, params);
			this.runPluginHandler('onError', err, params);

			this.options.onFinally?.(params, undefined, err);
			this.runPluginHandler('onFinally', params, undefined, err);

			this.setState({
				loading: false,
				error: err,
			});

			throw err;
		}
	}

	run(...params) {
		const { onError } = this.options;
		this.runAsync(...params).catch((err) => {
			if (!onError) {
				console.error(err);
			}
		});
	}

	refresh() {
		this.run.apply(this, this.state.params);
	}

	refreshAsync() {
		return this.runAsync.apply(this, this.state.params);
	}

	mutate(data) {
		const targetData = isFunction(data) ? data(this.state.data) : data;
		this.setState({ data: targetData });
		this.runPluginHandler('onMutate', targetData);
	}

	cancel() {
		this.count++;
		this.setState({ loading: false });
		this.runPluginHandler('onCancel');
	}

	runPluginHandler(event, ...rest) {
		const states = this.pluginImpls.map((impl) => impl[event]?.(...rest)).filter(Boolean);
		return Object.assign({}, ...states);
	}
}

export default Fetch;
