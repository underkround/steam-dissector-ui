
define([
	'config'
], function(config){

	var ProfileCollection = Backbone.Collection.extend({
		url: config.profilesUrl
	});

	return ProfileCollection;
});
