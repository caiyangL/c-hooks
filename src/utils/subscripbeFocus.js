import { isDocumentVisible, isOnline } from './helper';
import createSubscribe from './createSubscribe';

const { subscribe: subscribeFocus, trigger } = createSubscribe();

function reValidate() {
	if (isDocumentVisible() && isOnline()) {
		trigger();
	}
}

window.addEventListener('focus', reValidate);
window.addEventListener('visibilitychange', reValidate);

export default subscribeFocus;
