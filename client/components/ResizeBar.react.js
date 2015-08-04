import React from 'react';
import classNames from 'classnames';

const {Component, PropTypes} = React;

export default
class ResizeBar extends Component {

	static propTypes = {
		startResize : PropTypes.func,
		onResize    : PropTypes.func.isRequired,
		endResize   : PropTypes.func,
		value       : PropTypes.number.isRequired,
		minValue    : PropTypes.number,
		maxValue    : PropTypes.number,
		className   : PropTypes.string,
	};

	static defaultProps = {
		startResize : Function(),
		endResize   : Function(),
		minValue    : 0,
		maxValue    : Infinity,
		className   : '',
	}

	render(){
		let { className } = this.props;
		return <div
			className={ classNames('resize-bar', className ) }
			onMouseDown={(e) => this._startResize(e)} 
			{...this.forwardProps()}
			/>;
	}

	/**
         * Resolves all runtime properties that are not specified in
         * {@link propTypes}. Usually, these properties are passed down to
         * one of the child elements.
         *
         * @returns {object} All properties for forwarding.
         */
        forwardProps() {
                let other = {};
                for (let key in this.props) {
                        if (!this.constructor.propTypes.hasOwnProperty(key))
                                other[key] = this.props[key];
                }
                return other;
        }

	_startResize(e){
		let {minValue, maxValue} = this.props;
		let originalValue = this.props.value;
		let originalX     = e.clientX;

		let mousemove = (e) => {
			let value = originalValue + (e.clientX - originalX);
			value = Math.max(minValue, Math.min(value, maxValue));
			this.props.onResize(value);
		}

		document.addEventListener( 'mousemove', mousemove  );
		document.addEventListener( 'mouseup', (e) => {
			document.removeEventListener('mousemove', mousemove);
			this.props.endResize();
		} );

		e.preventDefault();
		this.props.endResize();
	}

}
