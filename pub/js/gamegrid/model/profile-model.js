
define([
	'underscore',
	'backbone',
	'config'
], function(
	_,
	Backbone,
	config
){

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
		},

		toJSON: function(options) {
			var data = _.clone(this.attributes);
			data.games = {};
			_.each(this.games.toJSON(), function(game) {
				data.games[game.id] = game;
			});
			return data;
		}
	});

	return ProfileModel;
});
