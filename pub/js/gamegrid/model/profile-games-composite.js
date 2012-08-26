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
		initialize: function() {
			this.games = new GameCollection;
			this.profiles = new ProfileCollection;

			this.games.on('add', this.onGameAdd, this);
			this.games.on('remove', this.onGameRemove, this);

			this.profiles.on('add', this.onProfileAdd, this);
			this.profiles.on('remove', this.onProfileRemove, this);

			// debug:
			window.debug = this;
			//this.games.on('all', function(){ console.log('event games:all', arguments); });
			//this.profiles.on('all', function(){ console.log('event profiles:all', arguments); });
		},

		addProfile: function(profileId) {
			var self = this;
			var profile = new ProfileModel({
				id: profileId
			});
			profile.fetch({
				success: function(){
					self.profiles.add(profile);
				},
				error: function(){
					console.error('Could not load profile', profile.get('id'), profile);
					self.trigger('addprofile:error', profile);
				}
			})
		},

		onProfileAdd: function(profile) {
			profile.games.on('reset', this.addGames, this);
			if (profile.games.length < 1) {
				profile.fetchGames();
			}
		},

		onProfileRemove: function(profile) {
			// @TODO
			console.log('TODO: onProfileRemove', profile, arguments);
		},

		addGames: function(games) {
			if (_.isArray(games)) {
				this.games.addGames(games);
			} else if (_.isObject(games)) {
				this.games.addGames(games.pluck('id'));
			} else if (_.isString(games) || _.isNumber(games)) {
				this.games.addGames([games]);
			}
		},

		toJSON: function() {
			var data = {
				games: this.games.toJSON(),
				profiles: []
			};
			this.profiles.each(function(profile) {
				var profileId = profile.id;
				var profileData = profile.toJSON();
				profileData.games = {};
				//data.profiles[profileId].games = {};
				_.each(profile.games.toJSON(), function(profileGame) {
					profileData.games[profileGame.id] = profileGame;
					//data.profiles[profileId].games[profileGame.id] = profileGame;
				});
				data.profiles.push(profileData);
			});
			return data;
		}
	});

	return ProfileGamesComposite;
});
