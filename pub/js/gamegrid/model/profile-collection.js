
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
		url: config.profilesUrl,

		filteredToJSON: function(options) {
			// no filters for profiles atm
			return this.toJSON(options);
		}
	});

	return ProfileCollection;
});
