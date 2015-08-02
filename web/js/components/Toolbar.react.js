import React from 'react';
import classNames from 'classnames';
import Button from 'react-bootstrap/lib/Button';
import EditorActions from '../actions/EditorActions.js';

const {Component, PropTypes} = React;

export default
class Toolbar extends Component {

	static propTypes = {
		status    : PropTypes.bool,
		isBusy    : PropTypes.bool.isRequired,
		isRunning : PropTypes.bool.isRequired,
	};

	render() {
		let {status, isRunning, isBusy} = this.props;
		let caption = isRunning ? 'Abort' : 'Analyze';

		return <header className={classNames('toolbar', 'toolbar-' + status)}>
			<span className="toolbar-title">Forest</span>
			<Button
				bsSize={'large'}
				className={classNames('action-run', 'pull-right')}
				children={caption}
				disabled={isBusy}
				onClick={() => this._onRun()}
				/>
		</header>
	}

	/**
	 *
	 * @private
	 */
	_onRun() {
		EditorActions.run();
	}

}
