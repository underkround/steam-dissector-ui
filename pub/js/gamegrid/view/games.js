
define([
	'text!templates/gamegrid/games.html'
], function(templateString) {

	var GamesView = Backbone.View.extend({
		template: _.template(templateString, null, {variable: 'data'}),

		events: {
			'click .ordering .order-by': 'onOrderByClick'
		},

		initialize: function() {
			this.model.games
				.on('add', this.onGameAdd, this)
				.on('remove', this.onGameRemove, this)
				.on('addgames:end', this.render, this)
				.on('reset', this.render, this);

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

		onGameAdd: function() {
			// @TODO
		},

		onGameRemove: function() {
			// @TODO
		},

		render: function(){
			var data = this.model.toJSON(),
				games = this.model.games;
			data.orderKeys = {
				name: 'Name',
				releaseDate: 'Released',
				ownerHours: 'Hours',
				metascore: 'Rating'
			};

			this.$el.html(this.template(data));

			//this.$('img').lazyload(); // disabled: was serious CPU-eater on large page

			var orderBy = this.$('.order-by[value="' + games.orderKey + '"]');
			if (games.reverse) {
				orderBy.addClass('active active-desc');
			} else {
				orderBy.addClass('active active-asc');
			}
		}
	});

	return GamesView;
});
