import React from 'react';
import classNames from 'classnames';
import Button from 'react-bootstrap/lib/Button';
import EditorActions from '../actions/EditorActions.js';

const {Component, PropTypes} = React;

export default
class Toolbar extends Component {

	static propTypes = {
		status    : PropTypes.string,
		isBusy    : PropTypes.bool.isRequired,
		isRunning : PropTypes.bool.isRequired,
	};

	render() {
		let {status, isRunning, isBusy} = this.props;
		let caption = isRunning ? 'Abort' : 'Analyze';
		let icon = (isRunning || isBusy) ? 'fa-refresh fa-spin'
			: this._getStatusIcon(status);

		return <header className={classNames('toolbar', this._getStatusClass(status))}>
			<span className="toolbar-title"><strong>Forest</strong> Dynamic Execution</span>

			<div className={'pull-right'}>
				<Button
					bsSize={'large'}
					className={'action-run'}
					children={caption}
					disabled={isBusy}
					onClick={() => this._onRun()}
					/>

				<i className={classNames('status', 'fa', icon)} />
			</div>
		</header>
	}

	_getStatusClass(status) {
		switch (status) {
			case 'TRUE'  : return 'toolbar-true';
			case 'FALSE' : return 'toolbar-false';
			case '???'   : return 'toolbar-unknown';
			default      : return 'toolbar-null';
		}
	}

	_getStatusIcon(status) {
		switch (status) {
			case 'TRUE'  : return 'fa-check';
			case 'FALSE' : return 'fa-times';
			case '???'   : return 'fa-question';
			default      : return 'status-null';
		}
	}

	/**
	 *
	 * @private
	 */
	_onRun() {
		if(this.props.isRunning)
			EditorActions.abort();
		else
			EditorActions.run();
	}

}
