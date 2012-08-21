
define([
	'text!templates/gamegrid/filters.html'
], function(templateString) {

	var GameGridFiltersView = Backbone.View.extend({
		template: _.template(templateString, null, {variable: 'data'}),

		events: {
			'click button.filter': 'onFilterClick'
		},

		initialize: function() {
		},

		onFilterClick: function(event){
			$(event.currentTarget).toggleClass('active');
			this.updateFilters();
		},

		updateFilters: function(){
			this.$('.filter.active').each(function(){
				console.log(this);
			});
		},

		render: function(){
			this.$el.html(this.template({}));
		}
	});

	return GameGridFiltersView;
});
