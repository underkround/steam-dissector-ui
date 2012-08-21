
define([
	'text!templates/gamegrid/index.html',
	'gamegrid/view/filters',
	'gamegrid/view/games',
	'gamegrid/view/controls',
	'gamegrid/model/source-collection',
], function(
	templateString,
	GameGridFiltersView,
	GameGridGamesView,
	GameGridControlsView,
	GameGridSourceCollection
) {

	var GameGridIndexView = Backbone.View.extend({
		template: _.template(templateString, null, {variable: 'data'}),

		initialize: function() {
			this.model = new GameGridSourceCollection();
		},

		render: function() {
			this.$el.html(this.template({}));

			var filtersView = new GameGridFiltersView({
				el: this.$('#gamegrid-filters'),
				model: this.model
			});
			filtersView.render();

			var controlsView = new GameGridControlsView({
				el: this.$('#gamegrid-controls'),
				model: this.model
			});
			controlsView.render();

			console.log(GameGridGamesView);
			var gamesView = new GameGridGamesView({
				el: this.$('#gamegrid-games'),
				model: this.model.games
			});
			gamesView.render();

			return this;
		}
	});

	return GameGridIndexView;
});
