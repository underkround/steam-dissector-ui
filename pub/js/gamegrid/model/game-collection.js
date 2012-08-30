/**
 *
 * Events:
 *   fetchgames:begin     (status)
 *   fetchgames:done      (status)
 *   fetchgames:tick      (status, id)
 *   fetchgames:success   (status, id)
 *   fetchgames:error     (status, id)
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

		initialize: function() {
			this.orderReverse = false;
			this.orderKey = 'name';
			this.filterCallback = null;
		},

		setFilter: function(filter) {
			this.filterCallback = filter;
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

		fetchGames: function(idsToAdd) {
			var self = this,
				existingIds = this.pluck('id');
				newIds = _.difference(idsToAdd, existingIds);

			var status = new utils.LoadStatus(newIds, function() {
				self.trigger('fetchgames:done', status);
			});

			this.trigger('fetchgames:begin', status);

			_.each(newIds, function(id) {
				var game = new GameModel({id: id});
				game.fetch({
					success: function(){
						var id = game.get('id');
						status.success(id);
						self.trigger('fetchgames:success', status, id)
							.trigger('fetchgames:tick', status, id)
							.add(game);
					},
					error: function(){
						var id = game.get('id');
						status.error(id);
						self.trigger('fetchgames:error', status, id)
							.trigger('fetchgames:tick', status, id);
					}
				})
			});
		},

		getFiltered: function() {
			return (this.filterCallback)
				? this.filter(this.filterCallback)
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
