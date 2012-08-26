
require.config({
	paths: {
		jquery: 'lib/jquery-1.8.0.min',
		underscore: 'lib/underscore-1.3.3.min-amd',
		backbone: 'lib/backbone-0.9.2.min-amd',
		text: 'lib/require-text',
		templates: '../tpl'
	},
	urlArgs: 'v=' + (new Date()).getTime()
});

require([
	'jquery',
	'underscore',
	'backbone',
	'gamegrid/view/index'
], function($, _, Backbone, GameGridIndex) {

	var gameGridIndex = new GameGridIndex({
		el: '#app'
	});

	gameGridIndex.render();

});
