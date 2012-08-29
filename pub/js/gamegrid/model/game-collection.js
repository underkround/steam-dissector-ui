/**
 *
 * Events:
 *   addgames:begin     (status)
 *   addgames:done      (status)
 *   addgames:tick      (status, id)
 *   addgames:success   (status, id)
 *   addgames:error     (status, id)
 */

define([
	'underscore',
	'backbone',
	'config',
	'utils',
	'gamegrid/model/game-model'
], function(
	_,
	Backbone,
	config,
	utils,
	GameModel
) {

	var GameCollection = Backbone.Collection.extend({
		url: config.gamesUrl,
		orderReverse: false,
		orderKey: 'name',
		viewFilter: null,

		initialize: function() {
		},

		orderByToggle: function(orderKey) {
			if (orderKey === this.orderKey) {
				this.orderReverse = ! this.orderReverse;
			} else {
				this.orderKey = orderKey;
				this.orderReverse = false;
			}
			this.sort();
		},

		comparator: function(game) {
			return game.get(this.orderKey) || 0;
		},

		sortBy: function() {
			var comparator = _.bind(this.comparator, this);
			if (this.orderReverse) {
				return _.sortBy(this.models, comparator).reverse();
			}
			return _.sortBy(this.models, comparator);
		},

		addGames: function(idsToAdd) {
			var self = this,
				existingIds = this.pluck('id');
				newIds = _.difference(idsToAdd, existingIds);

			var status = new utils.LoadStatus(newIds, function() {
				self.trigger('addgames:done', status);
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

		getFiltered: function() {
			return (this.viewFilter)
				? this.filter(this.viewFilter)
				: this.models;
		},

		filteredToJSON: function(options) {
			return _.map(this.getFiltered(), function(game) {
				return game.toJSON(options);
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
				var gameProperties;
				for (key in properties) {
					gameProperties = game.get(key);
					if (gameProperties) {
						properties[key] = _.union(properties[key], gameProperties);
					}
				}
			});
			return properties;
		}
	});

	return GameCollection;
});
