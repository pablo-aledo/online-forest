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
		let icon = (isRunning || isBusy) ? 'fa-refresh fa-spin'
			: (status == null) ? 'status-null'
			: status ? 'fa-check' : 'fa-times';

		return <header className={classNames('toolbar', 'toolbar-' + status)}>
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

	/**
	 *
	 * @private
	 */
	_onRun() {
		EditorActions.run();
	}

}
