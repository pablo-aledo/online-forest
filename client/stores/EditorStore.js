import Store from './Store';
import ForestService from '../services/ForestService';

class EditorStore extends Store {

	_code = '';
	_settings = {};
	_status = null;
	_busy = false;
	_running = false;

	getCode() {
		return this._code;
	}

	getSettings() {
		return this._settings;
	}

	getStatus() {
		return this._status;
	}

	isBusy() {
		return this._busy;
	}

	isRunning() {
		return this._running;
	}

	doEditorReset() {
		this._code = `int main() {

	return 0;
}
`;
		this._busy = false;
		this._status = null;
		setTimeout(() => this.emitChange(), 0);
	}

	doEditorUpdate(code) {
		this._code = code;
		this.emitChange();
	}

	doEditorRun() {
		ForestService.runCode(this._code, {});
		this._busy = true;
		this.emitChange();
	}

	doEditorAbort() {
		ForestService.abort();
		this._busy = true;
		this.emitChange();
	}

	doEditorReceiveRunning() {
		this._busy = false;
		this._running = true;
		this.emitChange();
	}

	doEditorReceiveSuccess(status, warnings) {
		this._busy = false;
		this._running = false;
		this._status = status;
		this.emitChange();
	}

	doEditorReceiveError() {
		this._busy = false;
		this._running = false;
		this._status = false;
		this.emitChange();
	}

	doEditorReceiveCode(code) {
		this._busy = false;
		this._status = null;
		this._code = code;
		setTimeout(() => this.emitChange(), 0);
	}

}

export default new EditorStore();
