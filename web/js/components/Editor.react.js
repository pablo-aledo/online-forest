import React from 'react';
import Input from 'react-bootstrap/lib/Input';
import EditorActions from '../actions/EditorActions.js';

const {Component, PropTypes} = React;

export default
class Editor extends Component {

	static propTypes = {
		code : PropTypes.string.isRequired,
	};

	render() {
		let {code} = this.props;
		return <Input
			ref='code'
			type='textarea'
			className={'editor'}
			value={code}
			onChange={value => this._onChange(value)}
			/>;
	}

	/**
	 *
	 * @param value
	 * @private
	 */
	_onChange(value) {
		let {code} = this.refs;
		EditorActions.update(code.getValue());
	}

}
