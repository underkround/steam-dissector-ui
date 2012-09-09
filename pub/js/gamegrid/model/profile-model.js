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

		hasGame: function(game) {
			return !! this.getGame(game);
		},

		getGame: function(game) {
			var gameId = this._parseGameId(game);
			return this.games[gameId];
		},

		getHoursOnRecordForGame: function(game) {
			game = this.getGame(game);
			if (game) {
				return parseFloat(game.hoursOnRecord) || 0.0;
			}
			return 0.0;
		},

		getHoursLast2WeeksForGame: function(game) {
			game = this.getGame(game);
			if (game) {
				return parseFloat(game.hoursLast2Weeks) || 0.0;
			}
			return 0.0;
		},

		toJSON: function(options) {
			var data = _.clone(this.attributes);
			data.games = this.games;
			return data;
		},

		_parseGameId: function(game) {
			if (_.isObject(game)) {
				return (typeof game.get === 'function')
					? game.get('id')
					: game.id;
			}
			return game;
		}
	});

	return ProfileModel;
});
