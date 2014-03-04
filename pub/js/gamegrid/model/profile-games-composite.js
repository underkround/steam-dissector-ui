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
	'gamegrid/model/profile-model',
	'utils'
], function(
	_,
	Backbone,
	config,
	GameCollection,
	ProfileCollection,
	GameModel,
	ProfileModel,
	utils
){

	var ProfileGamesComposite = Backbone.Model.extend({
		availableSorters: {},

		initialize: function() {
			this.games = new GameCollection();
			this.profiles = new ProfileCollection();

			this.games
				.on('add', this.onGameAdd, this)
				.on('remove', this.onGameRemove, this)
				.on('exists', this.onGameExists, this);

			this.profiles
				.on('add', this.onProfileAdd, this)
				.on('remove', this.onProfileRemove, this);

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
			if (_.isEmpty(profile.games)) {
				profile.fetchGames();
			}
		},

		onProfileRemove: function(profile) {
			var self = this,
				idsToRemove = [];
			this.games.each(function(game) {
				game.removeOwner(profile);
				if ( ! game.hasOwners()) {
					idsToRemove.push(game.id);
				}
			});
			this.games.remove(idsToRemove);
		},

		onGameExists: function(game) {
			this.addOwnersToGame(game);
		},

		onGameAdd: function(game) {
			this.addOwnersToGame(game);
		},

		addOwnersToGame: function(game) {
			this.profiles.each(function(profile) {
				if (profile.hasGame(game)) {
					game.addOwner(profile);
				}
			});
		},

		onGameRemove: function(game) {
			// @TODO (?)
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

		addAvailableSorter: function(id, title, sortFunction) {
			var sorter = {
				id: id,
				title: title,
				sortFunction: sortFunction
			};
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

	var sortByInteger = function(a, b, key, i) {
		var ad = parseInt(a.get(key), 10), bd = parseInt(b.get(key), 10);
		if (ad < bd) return i * -1;
		if (ad > bd) return i * 1;
		if (!isNaN(ad) && isNaN(bd)) return -1;
		if (isNaN(ad) && !isNaN(bd)) return 1;
		return utils.alphabeticalCompare(a.get('name'), b.get('name'));
	}

	addSorter('name', 'Name', null);

	addSorter('releaseDate', 'Released', function(a, b) {
		return sortByInteger(a, b, 'releaseDate', 1);
	});

	addSorter('ownerHoursTotal', 'Hours (total)', function(a, b) {
		var totalGameHours = function(game) {
			return _.reduce(game.owners, function(memo, profile) {
				var profileGame = profile.games[game.id];
				if (profileGame) {
					memo += parseFloat(profileGame.hoursOnRecord)
				}
				return memo;
			}, 0);
		}
		var aHours = totalGameHours(a);
		var bHours = totalGameHours(b);
		if (aHours < bHours) return 1;
		if (aHours > bHours) return -1;
		return utils.alphabeticalCompare(a.get('name'), b.get('name'));
	});

	addSorter('metascore', 'Rating', function(a, b) {
		return sortByInteger(a, b, 'metascore', -1);
	});

	return ProfileGamesComposite;
});
