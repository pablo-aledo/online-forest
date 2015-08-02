import React from 'react';
import Editor from './Editor.react';
import Toolbar from './Toolbar.react';

import EditorStore from '../stores/EditorStore';
import EditorActions from '../actions/EditorActions';

const {Component, PropTypes} = React;

export default
class ForestOnline extends Component {

	constructor(props) {
		super(props);
		this.state = this._getState();
		this._onChange = this._onChange.bind(this);
	}

	componentDidMount() {
		EditorStore.addChangeListener(this._onChange);
	}

	componentWillUnmount() {
		EditorStore.removeChangeListener(this._onChange);
	}

	render() {
		let {code, status, isBusy, isRunning} = this.state;

		return <div className={'forest'}>
			<Toolbar
				status={status}
				isBusy={isBusy}
				isRunning={isRunning}
				/>
			<Editor code={code} />
		</div>;
	}

	_getState() {
		return {
			code      : EditorStore.getCode(),
			settings  : EditorStore.getSettings(),
			status    : EditorStore.getStatus(),
			isBusy    : EditorStore.isBusy(),
			isRunning : EditorStore.isRunning(),
		};
	}

	/**
	 * Refreshes the state of this component.
	 * @private
	 */
	_onChange() {
		this.setState(this._getState());
	}

}
