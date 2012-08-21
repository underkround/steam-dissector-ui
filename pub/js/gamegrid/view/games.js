
define([
	'text!templates/gamegrid/games.html'
], function(templateString) {

	var GameGridGamesView = Backbone.View.extend({
		template: _.template(templateString, null, {variable: 'data'}),

		initialize: function() {
		},

		render: function(){
			this.$el.html(this.template({}));
		}
	});

	return GameGridGamesView;
});
