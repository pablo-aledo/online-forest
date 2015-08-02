import Events from 'events';
import Dispatcher from '../dispatcher/Dispatcher';
import assign from 'object-assign';

/**
 * Used to identify the change event in Stores internally.
 * @type {string}
 */
const EVENT_CHANGE = 'change';

/**
 * Base class for all data stores.
 *
 * Stores contain application data and state. While some might be client-
 * side only, most of them will communicate with a REST interface or web
 * service to store data persistently.
 *
 * To propagate changes to the user interface, stores implement the
 * {@link EventEmitter} interface. Views can register for change events
 * and render the new information. To notify listeners on changes, call
 * the {@link emitChange} method.
 *
 * Stores implement handlers for actions defined in an {@link Actions}
 * interface. By convention, these methods have the name
 * "doExampleSomething", where "Example" is the action interface name and
 * "Something" is the action name itself. The signature looks like this:
 *
 *     doExampleSomething(param1, param2) {
 *       ...
 *       this.emitChange();
 *     }
 *
 * @todo doc this.waitFor
 */
export default
class Store {

	/**
	 * Creates a new Store instance and link it to the global Dispatcher.
	 */
	constructor() {
		this._eventEmitter = assign({}, Events.EventEmitter.prototype);
		this.dispatcher = Dispatcher.register(action => this._dispatch(action));
	}

	/**
	 * Add a new listener for the change event. The listener will be
	 * called every time, {@link emitChange} is called in the store.
	 *
	 * @param {function} callback A listener to add.
	 */
	addChangeListener(callback) {
		this._eventEmitter.on(EVENT_CHANGE, callback);
	}

	/**
	 * Removes the given listener from the event queue. This is very
	 * useful, when the connected component is being destroyed. The
	 * listener will not be called on {@link emitChange} anymore.
	 *
	 * @param {function} callback The listener to remove.
	 */
	removeChangeListener(callback) {
		this._eventEmitter.removeListener(EVENT_CHANGE, callback);
	}

	/**
	 * Notify all listeners that contents of this store have changed.
	 * Usually, this will trigger the views to render their contents.
	 * @protected
	 */
	emitChange() {
		this._eventEmitter.emit(EVENT_CHANGE);
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
