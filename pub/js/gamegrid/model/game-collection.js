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
		reverse: false,
		orderKey: 'name',

		initialize: function() {
		},

		orderByToggle: function(orderKey) {
			if (orderKey === this.orderKey) {
				this.reverse = ! this.reverse;
			} else {
				this.orderKey = orderKey;
				this.reverse = false;
			}
			this.sort();
		},

		comparator: function(game) {
			return game.get(this.orderKey) || 0;
		},

		sortBy: function() {
			if (this.reverse) {
				return _.sortBy(this.models, this.comparator).reverse();
			}
			return _.sortBy(this.models, this.comparator);
		},

		addGames: function(idsToAdd) {
			var self = this,
				existingIds = this.pluck('id');
				newIds = _.difference(idsToAdd, existingIds);

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
					},
					error: function(){
						var id = game.get('id');
						status.error(id);
						self.trigger('addgames:error', status, id)
							.trigger('addgames:tick', status, id);
					}
				})
			});
		},

		getProperties: function() {
			var properties = {
				developers: [],
				features: [],
				genres: [],
				publishers: []
			};
			this.each(function(game) {
				for (key in properties) {
					properties[key] = _.union(properties[key], game.get(key));
				}
			});
			return properties;
		}
	});

	return GameCollection;
});
