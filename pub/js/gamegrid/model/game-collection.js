define([], function(){

	var GameCollection = Backbone.Collection.extend({
		url: 'http://backend.steam.localhost/',

		initialize: function() {
			this.fetch('http://')
		}
	});

	return GameCollection;

});
