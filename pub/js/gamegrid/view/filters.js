
define([
	'jquery',
	'underscore',
	'backbone',
	'config',
	'text!templates/gamegrid/filters.html'
], function(
	$,
	_,
	Backbone,
	config,
	templateString
) {

	var FiltersView = Backbone.View.extend({
		template: _.template(templateString, null, {variable: 'data'}),

		selectedValuesByFilterId: {},

		events: {
			'click button.filter': 'onFilterClick'
		},

		initialize: function() {
			var throttledRender = _.throttle(this.render, config.tickUpdateInterval);

			this.model.games
				.on('fetchgames:done', this.render, this)
				.on('fetchgames:tick', throttledRender, this)
				.on('filters:reset', this.render, this);

			this.$el.hide();
		},

		onFilterClick: function(event) {
			$(event.currentTarget).toggleClass('active');
			this.updateFilters();
		},

		updateFilters: function() {
			var self    = this,
				games   = this.model.games,
				filters = [];
			this.selectedValuesByFilterId = {};
			this.$('.filter.active').each(function() {
				var $this    = $(this),
					value    = $this.val(),
					filterId = $this.attr('data-filter-id');
				if (filterId) {
					if ( ! self.selectedValuesByFilterId[filterId]) {
						self.selectedValuesByFilterId[filterId] = [];
					}
					self.selectedValuesByFilterId[filterId].push(value);
				}
			});
			console.log('using filter values', self.selectedValuesByFilterId);
			_.each(self.selectedValuesByFilterId, function(values, filterId) {
				if (self.filterFactories[filterId]) {
					var filter = self.filterFactories[filterId].create(values);
					filters.push(filter);
				}
			});
			games.setFilters(filters);
		},

		getFilterSetsForRender: function() {
			var self         = this,
				visibleGames = this.model.games.getFiltered(),
				allGames     = this.model.games.getAll(),
				filterSets   = [];
			filterSets.hasValues = false;
			_.each(this.filterFactories, function(filterFactory) {
				var filterId = filterFactory.id;
				var temp = filterFactory.parseValues(visibleGames);
				var filterSet = {
					id:              filterId,
					title:           filterFactory.title,
					availableValues: filterFactory.parseValues(allGames),
					selectedValues:  self.selectedValuesByFilterId[filterId] || [],
					enabledValues:   _(temp).map(
						function(item) {
							return item.value || item;
						}
					)
				};
				if ( ! filterSet.hasValues && ! _.isEmpty(filterSet.availableValues)) {
					filterSets.hasValues = true;
				}
				filterSets.push(filterSet);
			});
			return filterSets;
		},

		render: function() {
			var data = {
				filterSets: this.getFilterSetsForRender(),
				owners:     this.model.profiles.toJSON()
			};
			if (data.filterSets.hasValues) {
				this.$el.fadeIn();
			} else {
				this.$el.fadeOut();
			}
			this.$el.html(this.template(data));
		}
	});

	FiltersView.prototype.filterFactories = {};

	var addFilterFactory = function(filterFactory) {
		FiltersView.prototype.filterFactories[filterFactory.id] = filterFactory;
	};

	// -----

	addFilterFactory({
		id:     'owners',
		title:  'By owners',
		create: function(filterValues) {
			return function(game) {
				return true; // @TODO
			};
		},
		parseValues: function(games) {
			var owners = this._parseOwners(games);
			return _.map(owners, function(owner) {
				return {
					value: owner.id,
					title: owner.get('name')
				};
			});
		},
		_parseOwners: function(games) {
			return _.chain(games)
				.pluck('owners')
				.flatten()
				.uniq()
				.value();
		}
	});

	// create these 4 similar filters
	var specs = [
		['genres', 'By genres'],
		['features', 'By features'],
		['developers', 'By developers'],
		['publishers', 'By plublishers']
	];
	for (var i in specs) {
		var id = specs[i][0],
			title = specs[i][1];
		addFilterFactory({
			id:     id,
			title:  title,
			create: function(filterValues) {
				var filterId = this.id;
				return function(game) {
					var ref = _(game.get(filterId));
					// Why does this not work:  !
					//return _(filterValues).every(ref.contains);
					return _(filterValues).every(function(filterValue) {
						return ref.contains(filterValue);
					});
				};
			},
			parseValues: function(games) {
				var self = this;
				return _.chain(games)
					.map(function(game){
						return game.get(self.id) || [];
					})
					.flatten()
					.unique()
					.value();
			}
		});
	}

	return FiltersView;
});
