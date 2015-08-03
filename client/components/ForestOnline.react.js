import React from 'react';
import Editor from './Editor.react';
import Toolbar from './Toolbar.react';
import ExampleList from './ExampleList.react';

import EditorStore from '../stores/EditorStore';
import ExampleStore from '../stores/ExampleStore';
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
		ExampleStore.addChangeListener(this._onChange);
		EditorActions.reset();
	}

	componentWillUnmount() {
		EditorStore.removeChangeListener(this._onChange);
		ExampleStore.removeChangeListener(this._onChange);
	}

	render() {
		let {code, status, isBusy, isRunning, exampleGroups, exampleFilter} = this.state;

		return <div className={'forest'}>
			<Toolbar
				status={status}
				isBusy={isBusy}
				isRunning={isRunning}
				/>
			<ExampleList
				groups={exampleGroups}
				filter={exampleFilter}
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

			exampleGroups : ExampleStore.getGroups(),
			exampleFilter : ExampleStore.getFilter(),
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
