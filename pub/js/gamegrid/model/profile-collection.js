
define([
	'underscore',
	'backbone',
	'config',
], function(
	_,
	Backbone,
	config
){

	var ProfileCollection = Backbone.Collection.extend({
		url: config.profilesUrl
	});

	return ProfileCollection;
});
