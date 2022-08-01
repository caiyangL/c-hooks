function createSubscribe() {
	let listeners = [];

	function subscribe(listener) {
		listeners.push(listener);
		function unSubscribe() {
			listeners = listeners.filter((l) => l !== listener);
		}
		return unSubscribe;
	}

	function trigger(...args) {
		listeners.forEach((listener) => {
			listener(...args);
		});
	}

	return { subscribe, trigger };
}

export default createSubscribe;
