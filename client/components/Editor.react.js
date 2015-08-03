import React from 'react';
import Input from 'react-bootstrap/lib/Input';
import EditorActions from '../actions/EditorActions';
import AceEditor from 'react-ace';
import Dropzone from 'react-dropzone';

import 'brace/mode/c_cpp';
import 'brace/theme/clouds';

const {Component, PropTypes} = React;

export default
class Editor extends Component {

	static propTypes = {
		code : PropTypes.string.isRequired,
	};


	render() {
		let {code} = this.props;
		return <div className={'main'}>
			<Dropzone 
				supportClick={false}
				multiple={false}
				onDrop={files => this._onDrop(files)} 
				height="100%" 
				width="100%">
				<AceEditor
					name={'editor'}
					mode={'c_cpp'}
					theme={'clouds'}
					value={code}
					onChange={value => this._onChange(value)}
					height={'100%'}
					width={'100%'}
					fontSize={15}
				/>
			</Dropzone>
		</div>
	}

	/**
	 *
	 * @param value
	 * @private
	 */
	_onChange(value) {
		EditorActions.update(value);
	}

	_onDrop(files) {
		EditorActions.upload(files[0]);
	}
}
