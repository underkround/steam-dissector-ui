/**
 *
 * Events:
 *   addprofile:success  (profile)
 *   addprofile:error    (profile)
 *
 */

define([
	'config',
	'gamegrid/model/game-collection',
	'gamegrid/model/profile-collection',
	'gamegrid/model/game-model',
	'gamegrid/model/profile-model'
], function(config, GameCollection, ProfileCollection, GameModel, ProfileModel){

	var ProfileGamesComposite = Backbone.Model.extend({
		initialize: function() {
			this.games = new GameCollection;
			this.profiles = new ProfileCollection;

			this.games.on('add', this.onGameAdd, this);
			this.games.on('remove', this.onGameRemove, this);

			this.profiles.on('add', this.onProfileAdd, this);
			this.profiles.on('remove', this.onProfileRemove, this);

			window.debug = this;
			// debug:
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
			console.log('onProfileAdd', profile);
			profile.games.on('reset', this.onProfileGamesReset, this);
			profile.fetchGames();
		},

		onProfileRemove: function(profile) {
			// @TODO
			console.log('onProfileRemove', profile, arguments);
		},

		onProfileGamesReset: function(profileGames) {
			this.games.addGames(profileGames.pluck('id'));
		},

		onGameAdd: function(game) {
			// @TODO
			//console.log('onGameAdd', game, arguments);
		},

		onGameRemove: function(game) {
			// @TODO
			//console.log('onGameRemove', game, arguments);
		},
	});

	return ProfileGamesComposite;
});
