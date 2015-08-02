import Actions from './Actions';

export default
class EditorActions extends Actions {

	static load(file) {
		super.dispatch('EditorLoad', file);
	}

	static update(code) {
		super.dispatch('EditorUpdate', arguments);
	}

	static run() {
		super.dispatch('EditorRun', arguments);
	}

	static abort() {
		super.dispatch('EditorAbort', arguments);
	}

	static receiveRunning() {
		super.dispatch('EditorReceiveRunning', arguments);
	}

	static receiveSuccess(status, warnings) {
		super.dispatch('EditorReceiveSuccess', arguments);
	}

	static receiveError(message) {
		super.dispatch('EditorReceiveError', arguments);
	}

}
