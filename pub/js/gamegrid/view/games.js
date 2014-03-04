
define([
	'jquery',
	'underscore',
	'backbone',
	'config',
	'text!templates/gamegrid/games.html',
	'utils'
], function(
	$,
	_,
	Backbone,
	config,
	templateString,
	utils
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
				var val = el.val();
				var sortFunction;
				var re = /^owner-(\d+)$/;
				var groups = re.exec(val);
				if (groups) {
					var ownerId = groups[1];
					var profile = _.find(this.model.profiles.models, function(owner){ return owner.id == ownerId });
					sortFunction = function(a, b) {
						var aGame = profile.games[a.id];
						var bGame = profile.games[b.id];
						if (aGame == null && bGame != null) return 1;
						if (aGame != null && bGame == null) return -1;
						if (aGame == null && bGame == null) return utils.alphabeticalCompare(a.get('name'), b.get('name'));
						var aHours = parseFloat(aGame.hoursOnRecord);
						var bHours = parseFloat(bGame.hoursOnRecord);
						if (aHours < bHours) return 1;
						if (aHours > bHours) return -1;
						return utils.alphabeticalCompare(a.get('name'), b.get('name'));
					};
				} else {
					sortFunction = this.model.getAvailableSorters()[val].sortFunction;
				}
				this.model.games.orderByToggle(val, sortFunction);
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
