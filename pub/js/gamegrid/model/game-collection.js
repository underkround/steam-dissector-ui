/**
 *
 * Events:
 *   addgames:begin     (status)
 *   addgames:end       (status)
 *   addgames:tick      (status, id)
 *   addgames:success   (status, id)
 *   addgames:error     (status, id)
 */

define([
	'config',
	'utils',
	'gamegrid/model/game-model'
], function(config, utils, GameModel) {

	var GameCollection = Backbone.Collection.extend({
		url: config.gamesUrl,

		initialize: function() {
		},

		addGames: function(idsToAdd) {
			console.log('adding games', idsToAdd);
			var self = this;
			var existingIds = this.pluck('id');
			var newIds = _.difference(idsToAdd, existingIds);
//			var allDone = _.after(newIds.length, function() {
//				console.log('composite -> addGames -> allDone');
//				self.trigger('addgames:end', newIds);
//			});

			var status = new utils.LoadStatus(newIds, function() {
				self.trigger('addgames:end', status);
			});

			this.trigger('addgames:begin', status);

			_.each(newIds, function(id) {
				var game = new GameModel({id: id});
				game.fetch({
					success: function(){
						var id = game.get('id');
						status.success(id);
						self.trigger('addgames:success', status, id)
							.trigger('addgames:tick', status, id)
							.add(game);
						//allDone();
					},
					error: function(){
						var id = game.get('id');
						status.error(id);
						self.trigger('addgames:error', status, id)
							.trigger('addgames:tick', status, id);
						//allDone();
					}
				})
			});
		}
	});

	return GameCollection;
});
