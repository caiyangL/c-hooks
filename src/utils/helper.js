export function depsAreSame(a, b) {
	if (a === b) return true;
	return a.every((item, i) => item === b[i]);
}

export function isFunction(value) {
	return typeof value === 'function';
}

export function isDocumentVisible() {
	return document.visibilityState === 'visible';
}

export function isOnline() {
	return navigator.onLine;
}

export function limit(fn, time) {
	let flag = false;
	return function (...args) {
		if (!flag) {
			flag = true;
			fn.apply(this, args);
			setTimeout(() => {
				flag = false;
			}, time);
		}
	};
}
