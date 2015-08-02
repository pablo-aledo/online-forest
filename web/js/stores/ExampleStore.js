import Store from './Store';
import ForestService from '../services/ForestService';

class ExampleStore extends Store {

	_filter = [];
	_examples = [];

	getExamples() {
		return this._examples;
	}

	getGroups() {
		let map = {};
		for (let example of this._examples) {
			if (!this._filterExample(example))
				continue;

			let group = map[example.category] = map[example.category] || [];
			group.push(example);
		}

		let groups = [];
		for (let name in map)
			groups.push({name, examples : map[name]});

		return groups;
	}

	getFilter() {
		return this._filter.join(' ');
	}

	doEditorUpdateFilter(filter) {
		this._filter = filter.split(/\s+/g);
		this.emitChange();
	}

	doEditorLoad(name) {
		ForestService.loadExample(name);
		this.emitChange();
	}

	doEditorReceiveExamples(examples) {
		this._examples = examples;
		this.emitChange();
	}

	_filterExample(example) {
		return this._filterValue(example.name)
			|| this._filterValue(example.category);
	}

	_filterValue(value) {
		return value.toLowerCase().match(this._filter.join('.*').toLowerCase()) != null;
	}

}

export default new ExampleStore();
