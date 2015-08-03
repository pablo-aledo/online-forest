import Dispatcher from '../dispatcher/Dispatcher';

/**
 *
 */
export default
class Service {

	/**
	 * Creates a new Service instance and link it to the global Dispatcher.
	 */
	constructor() {
		this.dispatcher = Dispatcher.register(action => this._dispatch(action));
	}

	/**
	 * Waits for the specified stores to finish their dispatching
	 * before continuing to process this action.
	 *
	 * @param stores A list of stores to wait for.
	 * @protected
	 */
	waitFor(...stores) {
		Dispatcher.waitFor(stores.map(s => s.dispatcher));
	}

	/**
	 * Dispatches the action to the handler method. By convention,
	 * the method name is derived from the action type prefixed by
	 * "do", e.g: "doActionType".
	 *
	 * The action contains a list of arguments which is directly
	 * passed to the invoked function. These arguments correspond
	 * to the parameters of the origin action method in the
	 * interface.
	 *
	 * Refer to {@link Actions} for more information on actions
	 * and their interfaces.
	 *
	 * @param {string} type The action type, identifying the handler.
	 * @param {array}  args Arguments to the action handler.
	 * @private
	 */
	_dispatch({type, args}) {
		let handler = this['do' + type];
		if (typeof handler === 'function')
			handler.apply(this, args);
	}

}
