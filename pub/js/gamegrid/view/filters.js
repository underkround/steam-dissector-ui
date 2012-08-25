
define([
	'text!templates/gamegrid/filters.html'
], function(templateString) {

	var FiltersView = Backbone.View.extend({
		template: _.template(templateString, null, {variable: 'data'}),

		events: {
			'click button.filter': 'onFilterClick'
		},

		initialize: function() {
			this.featuresEl   = this.$('.features');
			this.genresEl     = this.$('.genres');
			this.developersEl = this.$('.developers');
			this.publishersEl = this.$('.publishers');
		},

		onFilterClick: function(event) {
			$(event.currentTarget).toggleClass('active');
			this.updateFilters();
		},

		updateFilters: function(){
			var filters = [];
			this.$('.filter.active').each(function(){
				console.log(this);
			});
			console.log('using filters: ', filters);
		},

		render: function(){
			this.$el.html(this.template({}));
		}
	});

	return FiltersView;
});
