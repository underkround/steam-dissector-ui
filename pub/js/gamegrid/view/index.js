
define([
	'text!templates/gamegrid/index.html',
	'gamegrid/view/filters',
	'gamegrid/view/games',
	'gamegrid/view/controls',
	'gamegrid/model/profile-games-composite',
], function(
	templateString,
	FiltersView,
	GamesView,
	ControlsView,
	ProfileGamesComposite
) {

	var IndexView = Backbone.View.extend({
		template: _.template(templateString, null, {variable: 'data'}),

		initialize: function() {
			this.model = new ProfileGamesComposite();
			this.model.on('all', function(event) {
				console.log('Composite event: ', event, arguments);
			});
			this.model.on('addgames:done', function(){ console.log('composite addgames done')});
		},

		render: function() {
			this.$el.html(this.template({}));

			var filtersView = new FiltersView({
				el: this.$('#gamegrid-filters'),
				model: this.model
			});
			filtersView.render();

			var controlsView = new ControlsView({
				el: this.$('#gamegrid-controls'),
				model: this.model
			});
			controlsView.render();

			var gamesView = new GamesView({
				el: this.$('#gamegrid-games'),
				model: this.model
			});
			gamesView.render();

			return this;
		}
	});

	return IndexView;
});
