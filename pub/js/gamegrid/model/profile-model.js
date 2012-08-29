/**
 * Events:
 *  games:reset     (games, this)
 *  games:error     (this)
 */
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
			this.games = {};
		},

		parse: function(data) {
			if (data.gamesUrl) {
				data.absoluteGamesUrl = config.baseUrl + data.gamesUrl;
			}
			return data;
		},

		fetchGames: function(options) {
			var self = this;
			$.getJSON(this.get('absoluteGamesUrl'))
				.done(function(games) {
					self.games = {};
					_.each(games, function(game) {
						self.games[game.id] = game;
					});
					self.trigger('games:reset', self.games, self);
				}).error(function() {
					self.games = {};
					self.trigger('games:error', self);
				});
		},

		toJSON: function(options) {
			var data = _.clone(this.attributes);
			data.games = this.games;
			return data;
		}
	});

	return ProfileModel;
});
