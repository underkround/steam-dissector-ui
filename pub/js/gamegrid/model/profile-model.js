
define([
	'config'
], function(config){

	var ProfileModel = Backbone.Model.extend({
		urlRoot: config.profilesUrl,

		initialize: function() {
			this.games = new Backbone.Collection();
		},

		parse: function(data) {
			if (data.gamesUrl) {
				this.games.url = config.baseUrl + data.gamesUrl;
			}
			return data;
		},

		fetchGames: function(options) {
			this.games.fetch(options);
		}
	});

	return ProfileModel;
});
