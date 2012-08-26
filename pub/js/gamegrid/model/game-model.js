
define([
	'underscore',
	'backbone',
	'config'
], function(
	_,
	Backbone,
	config
){

	var GameModel = Backbone.Model.extend({
		urlRoot: config.gamesUrl
	});

	return GameModel;
});
