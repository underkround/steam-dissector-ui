/**
 *
 * Events:
 *   addprofile:success  (profile)
 *   addprofile:error    (profile)
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
			//this.debugOn();
		},

		debugOn: function(){
			this.games.on('all', function(){ console.log('event games:all', arguments); });
			this.profiles.on('all', function(){ console.log('event profiles:all', arguments); });
		},

		addProfile: function(profileId) {
			var self = this;
			var profile = new ProfileModel({
				id: profileId
			});
			profile.fetch({
				success: function(){
					self.profiles.add(profile);
					self.trigger('addprofile:success', profile);
				},
				error: function(){
					console.error('Could not load profile', profile.get('id'), profile);
					self.trigger('addprofile:error', profile);
				}
			})
		},

		onProfileAdd: function(profile) {
			profile.on('games:reset', this.addGames, this);
			if (_.isEmpty(profile.games.length)) {
				profile.fetchGames();
			}
		},

		onProfileRemove: function(profile) {
			// @TODO
			console.log('TODO: onProfileRemove', profile, arguments);
		},

		onGameAdd: function(game) {
			// @TODO
		},

		onGameRemove: function(game) {
			// @TODO
		},

		addGames: function(games) {
			if (_.isArray(games)) {
				this.games.addGames(games);
			} else if (_.isObject(games)) {
				this.games.addGames(_.pluck(games, 'id'));
			} else if (_.isString(games) || _.isNumber(games)) {
				this.games.addGames([games]);
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

	addSorter('ownerHours', 'Hours', function(game) {
		return _.reduce(game.owners, function(memo, profile) {
			var profileGame = profile.getGame(game.id);
			return (profileGame && profileGame.hours)
				? profileGame.hours
				: 0;
		}, 0);
	});

	addSorter('metascore', 'Rating', function(game) {
		return (game.metascore > 0) ? game.metascore : 0;
	});

	return ProfileGamesComposite;
});
