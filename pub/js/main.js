
require.config({
	paths: {
		underscore: 'lib/underscore-1.3.3.min',
		backbone: 'lib/backbone-0.9.2min',
		text: 'lib/require-text',
		templates: '../tpl'
	},
	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore'],
			exports: 'Backbone'
		},
		'app': {
			deps: ['backbone']
		},
		'router': {
			deps: ['backbone']
		}
	},
	urlArgs: 'v=' + (new Date()).getTime()
});

require([
	'underscore',
	'backbone',
	'gamegrid/view/index'
], function(_, Backbone, GameGridIndex) {

	var gameGridIndex = new GameGridIndex({
		el: '#app'
	});
	gameGridIndex.render();

});
