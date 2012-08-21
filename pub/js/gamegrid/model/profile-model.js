define([], function(){

	var GameGridProfileModel = Backbone.Model.extend({
		urlRoot: 'http://proxy.steam.localhost/profiles'
	});

	return GameGridProfileModel;

});
