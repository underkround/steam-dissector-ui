
define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/gamegrid/games.html'
], function(
	$,
	_,
	Backbone,
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
			this.model.games
				.on('add', this.onGameAdd, this)
				.on('remove', this.onGameRemove, this)
				.on('addgames:done', this.render, this)
				.on('reset', this.render, this);

			this.$el.hide();

			// debug
			//this.model.on('all', function(){console.log(arguments);});
			//this.model.games.on('all', function(){ console.log('games:all', arguments); });
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

		render: function(){
			var games = this.model.games;
			if (games.isEmpty()) {
				this.$el.fadeOut();
			} else {
				this.$el.fadeIn();
			}

			var data = this.model.filteredToJSON();
			data.sorters = this.model.getAvailableSorters();

			this.$el.html(this.template(data));

			var orderBy = this.$('.order-by[value="' + games.orderKey + '"]');
			if (games.orderReverse) {
				orderBy.addClass('active active-desc');
			} else {
				orderBy.addClass('active active-asc');
			}
		}
	});

	return GamesView;
});
