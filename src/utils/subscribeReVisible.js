import { isDocumentVisible } from './helper';
import createSubscribe from './createSubscribe';

const { subscribe: subscribeReVisible, trigger } = createSubscribe();

document.addEventListener('visibilitychange', () => {
	if (isDocumentVisible()) {
		trigger();
	}
});

export default subscribeReVisible;
