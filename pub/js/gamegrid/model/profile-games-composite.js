/**
 *
 * Events:
 *   addprofile:success  (profile)
 *   addprofile:error    (profile, xhr)
 *
 */

define([
	'underscore',
	'backbone',
	'config',
	'gamegrid/model/game-collection',
	'gamegrid/model/profile-collection',
	'gamegrid/model/game-model',
	'gamegrid/model/profile-model'
], function(
	_,
	Backbone,
	config,
	GameCollection,
	ProfileCollection,
	GameModel,
	ProfileModel
){

	var ProfileGamesComposite = Backbone.Model.extend({
		availableSorters: {},

		initialize: function() {
			this.games = new GameCollection;
			this.profiles = new ProfileCollection;

			this.games.on('add', this.onGameAdd, this);
			this.games.on('remove', this.onGameRemove, this);

			this.profiles.on('add', this.onProfileAdd, this);
			this.profiles.on('remove', this.onProfileRemove, this);

			// @TODO: remove some day
			window.debug = this;
			if (config.debug) {
				this.debugOn();
			}
		},

		debugOn: function(){
			this.on('all', function(){ console.log('[event] combiner:all', arguments); });
			this.games.on('all', function(){ console.log('[event] games:all', arguments); });
			this.profiles.on('all', function(){ console.log('[event] profiles:all', arguments); });
		},

		addProfile: function(profileId) {
			var self = this;
			var profile = new ProfileModel({
				id: profileId
			});
			profile.fetch({
				success: function(profile) {
					self.profiles.add(profile);
					self.trigger('addprofile:success', profile);
				},
				error: function(profile, xhr) {
					self.trigger('addprofile:error', profile, xhr);
				}
			});
		},

		onProfileAdd: function(profile) {
			profile.on('games:reset', this.fetchGames, this);
			if (_.isEmpty(profile.games.length)) {
				profile.fetchGames();
			}
		},

		onProfileRemove: function(profile) {
			this.games.each(function(game) {
				game.removeOwner(profile);
			});
		},

		onGameAdd: function(game) {
			this.profiles.each(function(profile) {
				if (profile.hasGame(game)) {
					game.addOwner(profile);
				}
			})
		},

		onGameRemove: function(game) {
			// @TODO
		},

		fetchGames: function(games) {
			if (_.isArray(games)) {
				this.games.fetchGames(games);
			} else if (_.isObject(games)) {
				this.games.fetchGames(_.pluck(games, 'id'));
			} else if (_.isString(games) || _.isNumber(games)) {
				this.games.fetchGames([games]);
			}
		},

		filteredToJSON: function() {
			return {
				games:    this.games.filteredToJSON(),
				profiles: this.profiles.filteredToJSON()
			};
		},

		toJSON: function(options) {
			return {
				games:    this.games.toJSON(options),
				profiles: this.profiles.toJSON(options)
			}
		},

		getAvailableSorters: function() {
			return this.availableSorters;
		},

		addAvailableSorter: function(id, title, sorter) {
			sorter.id = id;
			sorter.title = title;
			this.availableSorters[id] = sorter;
		}
	});


	//
	// Sorters
	//

	var addSorter = _.bind(
		ProfileGamesComposite.prototype.addAvailableSorter,
		ProfileGamesComposite.prototype
	);

	addSorter('name', 'Name', function(game) {
		return game.name;
	});

	addSorter('releaseDate', 'Released', function(game) {
		return game.releaseDate;
	});

	addSorter('ownerHoursTotal', 'Hours (total)', function(game) {
		return _.reduce(game.owners, function(memo, profile) {
			if (profile.games[game.id]) {
				memo += parseFloat(profileGame.hours)
			}
			return memo;
		}, 0);
	});

	addSorter('metascore', 'Rating', function(game) {
		return (game.metascore > 0) ? game.metascore : 0;
	});

	return ProfileGamesComposite;
});
