
define([
	'jquery',
	'underscore',
	'backbone',
	'config',
	'text!templates/gamegrid/games.html'
], function(
	$,
	_,
	Backbone,
	config,
	templateString
) {

	var GamesView = Backbone.View.extend({
		template: _.template(templateString, null, {variable: 'data'}),

		events: {
			'click .ordering .order-by':   'onOrderByClick',
			'click .ctrl-refresh-profile': 'onRefreshProfileClick',
			'click .ctrl-remove-profile':  'onRemoveProfileClick'
		},

		initialize: function() {
			var throttledRender = _.throttle(this.render, config.tickUpdateInterval);

			this.model.games
				.on('add', this.onGameAdd, this)
				.on('remove', this.onGameRemove, this)
				.on('fetchgames:done', this.render, this)
				.on('fetchgames:tick', throttledRender, this)
				.on('reset', this.render, this)
				.on('filters:reset', this.render, this);

			this.$el.hide();
		},

		onOrderByClick: function(event) {
			var el = $(event.currentTarget);
			if (el) {
				this.model.games.orderByToggle(el.val());
				if (this.model.games.length < 1) {
					this.render();
				}
			}
		},

		onRefreshProfileClick: function(event) {
			var el = $(event.currentTarget);
			if (el) {
				var model = this.model.profiles.get({id: el.attr('data-target')});
				if (model) {
					model.fetch();
				}
			}
		},

		onRemoveProfileClick: function(event) {
			var el = $(event.currentTarget);
			if (el) {
				this.model.profiles.remove({id: el.attr('data-target')});
				this.render();
			}
		},

		onGameAdd: function() {
			// @TODO
		},

		onGameRemove: function() {
			// @TODO
		},

		render: function() {
			var gamesColl = this.model.games;
			if (gamesColl.isEmpty()) {
				this.$el.fadeOut();
			} else {
				this.$el.fadeIn();
			}

			var data = this.model.filteredToJSON();
			data.sorters = this.model.getAvailableSorters();

			this.$el.html(this.template(data));

			var orderBy = this.$('.order-by[value="' + gamesColl.orderKey + '"]');
			if (gamesColl.orderReverse) {
				orderBy.addClass('active active-desc');
			} else {
				orderBy.addClass('active active-asc');
			}
		}
	});

	return GamesView;
});
