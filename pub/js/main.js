
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
	'router'
], function(_, Backbone, Router) {

	Router.initialize();

	$(document).on('click', 'a:not([data-bypass])', function(event){
		var href = $(this).attr('href'),
			protocol = this.protocol + '//';
		if (href &&
			href.slice(0, protocol.length) !== protocol &&
			href.indexOf('javascript:') !== 0
		) {
			event.preventDefault();
			Backbone.history.navigate(href, true);
		}
	});
});
