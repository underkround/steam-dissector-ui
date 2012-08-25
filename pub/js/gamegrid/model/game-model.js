
define([
	'config'
], function(config){

	var GameModel = Backbone.Model.extend({
		urlRoot: config.gamesUrl
	});

	return GameModel;
});
