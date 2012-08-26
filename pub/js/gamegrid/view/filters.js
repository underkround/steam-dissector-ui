
define([
	'text!templates/gamegrid/filters.html'
], function(templateString) {

	var FiltersView = Backbone.View.extend({
		template: _.template(templateString, null, {variable: 'data'}),

		events: {
			'click button.filter': 'onFilterClick'
		},

		initialize: function() {
			this.model.games.on('addgames:done', this.render, this);
			/*
			this.filterContainers = {
				features:   this.$('#filter-features .filters'),
				genres:     this.$('#filter-genres .filters'),
				developers: this.$('#filter-developers .filters'),
				publishers: this.$('#filter-publishers .filters'),
				owners:     this.$('#filter-owners .filters')
			};
			*/
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
			var data = this.model.games.getProperties();
			var isEmpty = true;
			for (k in data) {
				if ( ! _.isEmpty(data[k])) {
					isEmpty = false;
					break;
				}
			}
			if (isEmpty) {
				this.$el.html('');
			} else {
				data.owners = this.model.profiles.toJSON();
				this.$el.html(this.template(data));
			}
		}
	});

	return FiltersView;
});
