
define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/gamegrid/filters.html'
], function(
	$,
	_,
	Backbone,
	templateString
) {

	var FiltersView = Backbone.View.extend({
		template: _.template(templateString, null, {variable: 'data'}),

		events: {
			'click button.filter': 'onFilterClick'
		},

		initialize: function() {
			// TODO: debounce render on tick

			this.model.games.on('fetchgames:done', this.render, this);

			this.$el.hide();
		},

		onFilterClick: function(event) {
			$(event.currentTarget).toggleClass('active');
			this.updateFilters();
		},

		updateFilters: function() {
			var self = this,
				games = this.model.games,
				filters = {};
			games.resetFilters({silent: true});
			this.$('.filter.active').each(function() {
				var $this = $(this),
					value = $this.val(),
					set = $this.attr('data-set');
				if (set) {
					if ( ! filters[set]) {
						filters[set] = [];
					}
					filters[set].push(value);
				}
			});
			console.log('using filters: ', filters);
			_.each(filters, function(values, key) {
				if (self.filterFactories[key]) {
					games.addFilter(self.filterFactories[key](values));
				}
			});
			games.applyFilters();
		},

		render: function() {
			var data = this.model.games.getProperties();
			var isEmpty = true;
			for (k in data) {
				if ( ! _.isEmpty(data[k])) {
					isEmpty = false;
					break;
				}
			}
			if (isEmpty) {
				this.$el.fadeOut();
			} else {
				this.$el.fadeIn();
			}
			data.owners = this.model.profiles.toJSON();
			this.$el.html(this.template(data));
		},

		filterFactories: {
			// @TODO: owners

			features: function(filterValues) {
				return function(game) {
					var ref = _(game.get('features'));
					// Why does this not work:  !
					//return _(filterValues).every(features.contains);
					return _(filterValues).every(function(filterValue) {
						return ref.contains(filterValue);
					});
				};
			},

			genres: function(filterValues) {
				return function(game) {
					var ref = _(game.get('genres'));
					return _(filterValues).every(function(filterValue) {
						return ref.contains(filterValue);
					});
				};
			},

			developers: function(filterValues) {
				return function(game) {
					var ref = _(game.get('developers'));
					return _(filterValues).every(function(filterValue) {
						return ref.contains(filterValue);
					});
				};
			},

			publishers: function(filterValues) {
				return function(game) {
					var ref = _(game.get('publishers'));
					return _(filterValues).every(function(filterValue) {
						return ref.contains(filterValue);
					});
				};
			}
		}

	});

	return FiltersView;
});
