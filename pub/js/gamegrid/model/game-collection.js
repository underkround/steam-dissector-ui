/**
 *
 * Events:
 *   fetchgames:begin     (status, this)
 *   fetchgames:done      (status, this)
 *   fetchgames:tick      (status, id, this)
 *   fetchgames:success   (status, id, this)
 *   fetchgames:error     (status, id, this)
 *   filters:reset        (this)
 *   exists               (game)   when bulk-loadable game exists
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
			this.filters = [];
		},

		//
		// Filters
		//

		setFilters: function(filters, options) {
			this.filters = filters || [];
			if ( ! options || ! options.silent) {
				this.trigger('filters:reset', this);
			}
		},

		clearFilters: function(options) {
			this.filters = [];
			if ( ! options || ! options.silent) {
				this.trigger('filters:reset', this);
			}
		},

		//
		// Sorting (@TODO: refactor)
		//

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

		//
		// Games
		//

		fetchGames: function(idsToAdd) {
			var self = this,
				existingIds = this.pluck('id'),
				newIds = _.difference(idsToAdd, existingIds),
				existingAnnouncableIds = _.difference(idsToAdd, newIds);

			_.each(existingAnnouncableIds, function(id) {
				self.trigger('exists', self.get(id));
			});

			var status = new utils.LoadStatus(newIds, function() {
				self.trigger('fetchgames:done', status, self);
			});

			this.trigger('fetchgames:begin', status, self);

			_.each(newIds, function(id) {
				var game = new GameModel({id: id});
				game.fetch({
					success: function(){
						var id = game.get('id');
						status.success(id);
						self.trigger('fetchgames:success', status, id, self)
							.trigger('fetchgames:tick', status, id, self)
							.add(game);
					},
					error: function(){
						var id = game.get('id');
						status.error(id);
						self.trigger('fetchgames:error', status, id, self)
							.trigger('fetchgames:tick', status, id, self);
					}
				});
			});
		},

		getAll: function() {
			return this.models;
		},

		getFiltered: function() {
			var chain = _.chain(this.models);
			_.each(this.filters, function(filter) {
				chain = chain.filter(filter);
			});
			return chain.value();
		},

		filteredToJSON: function(options) {
			return _.map(this.getFiltered(), function(game) {
				return game.toJSON(options);
			});
		}
	});

	return GameCollection;
});
