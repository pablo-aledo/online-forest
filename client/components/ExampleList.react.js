import React from 'react';
import classNames from 'classnames';
import Input from 'react-bootstrap/lib/Input';
import EditorActions from '../actions/EditorActions.js';

const {Component, PropTypes} = React;

export default
class ExampleList extends Component {

	static propTypes = {
		filter : PropTypes.string.isRequired,
		groups : PropTypes.array.isRequired,
	};

	render() {
		let {groups, filter, ...other} = this.props;

		return <aside className={classNames('sidebar', 'example-list')} {...other}>
			<Input
				ref={'filter'}
				type={'text'}
				value={filter}
				onChange={() => this._onFilterChange()}
				className={classNames('filter', {'filled' : filter !== ''})}
				placeholder={'Search for examples...'}
				/>

			{filter ? null : <ul className="list-unstyled">
				<li className="example" onClick={() => this._selectNew()}>
					<i className="fa fa-file-o"></i>
					<span className="example-name">New Scratchpad</span>
				</li>
			</ul>}

			<ul className="list-unstyled">
				{groups.map(g => this.renderGroup(g))}
			</ul>


		</aside>;
	}

	renderGroup(group) {
		return <li key={group.name} className={'exampleGroup'}>
			<h4 className="group-title" onClick={() => this._toggleGroup(group)}>
				<i className = {classNames('fa', 'pull-right','text-muted', 'fa-chevron-down', {'fa-rotate-180' : !!group.isVisible })}/>
				{this._capitalize(group.name)}
			</h4>
			<ul className={classNames("list-unstyled","group", {'group-hidden' : !group.isVisible })}>
				{group.examples.map(e => this.renderExample(e))}
			</ul>
		</li>;
	}

	renderExample(example) {
		return <li key={example.name} className={'example'} onClick={() => this._selectExample(example.name)}>
			<i className="fa fa-file-code-o"></i>
			<span className="example-name" data-toggle="tooltip" title={example.name}>{example.name}</span>
		</li>;
	}

	_capitalize(text) {
		return text.replace(/\b[a-z]/g, letter => letter.toUpperCase()).replace('_', ' ');
	}

	/**
	 *
	 * @private
	 */
	_onFilterChange() {
		let {filter} = this.refs;
		EditorActions.updateFilter(filter.getValue());
	}

	_toggleGroup(group){
		EditorActions.toggleGroup(group);
	}

	/**
	 *
	 * @private
	 */
	_selectNew() {
		EditorActions.reset();
	}

	/**
	 *
	 * @param name
	 * @private
	 */
	_selectExample(name) {
		EditorActions.load(name);
	}

}
