import Dispatcher from '../dispatcher/Dispatcher';

/**
 * Base class for all action interfaces.
 *
 * Action interfaces contain methods to introduce new data or change into
 * the system. Each interface method triggers an action that sends parameters
 * to a listener function in one or more stores. Actions classes provide a
 * uniform interface to abstract these method calls using the Flux Dispatcher.
 *
 * Action interfaces are fully static classes, i.e. they have no instance
 * methods. By convention, their name except the trailing "Actions" is used in
 * events sent over the dispatcher and listener functions. Always declare them
 * as "export default" directly. Each function implementation must look like this:
 *
 *     static something(param1, param2) {
 *       super.dispatch('ExampleSomething', arguments);
 *     }
 *
 * Internally, this invokes the dispatcher and sends an "ExampleSomething", using
 * the class name for the first part, and method name for the second part. The
 * dispatcher sends all parameters to any store implementing the following
 * handler:
 *
 *     doExampleSomething(param1, param2) {
 *       ...
 *     }
 *
 */
export default
class Actions {

	/**
	 * Sends an action via the application dispatcher to all attached stores.
	 *
	 * @param {string} action The name of the action to be dispatched.
	 * @param {array}  args   Parameters passed to the action interface method.
	 */
	static dispatch(action, args) {
		Dispatcher.dispatch({
			type : action,
			args : args,
		});
	}

}
