import Service from './Service';
import EditorActions from '../actions/EditorActions';

/**
 *
 */
class ForestService extends Service {

	/**
	 *
	 */
	constructor() {
		super();

		let socket = this._socket = io.connect(location.origin);
		socket.on('forest-running', () => EditorActions.receiveRunning());
		socket.on('forest-success', ({status, warnings}) => EditorActions.receiveSuccess(status, warnings));
		socket.on('forest-error', ({message}) => EditorActions.receiveError(message));
		socket.on('example-list', examples => EditorActions.receiveExamples(examples));
		socket.on('example-code', ({name, code}) => EditorActions.receiveCode(code));
	}

	/**
	 *
	 * @param code
	 * @param settings
	 */
	runCode(code, settings) {
		this._socket.emit('run', { code, settings });
	}

	abort() {
		this._socket.emit('abort');
	}

	/**
	 *
	 * @param name
	 */
	loadExample(name) {
		this._socket.emit('get-code', { name });
	}

}

export default new ForestService();
