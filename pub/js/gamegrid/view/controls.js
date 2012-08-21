
define(['gamegrid/model/game-collection'], function(GameCollection) {

	var GameGridControlsView = Backbone.View.extend({
		events: {
			'click .add-profile': 'addProfile'
		},

		initialize: function() {
			var model = new GameCollection();
			console.log('qux');
			this.$el.html('asdf');
		},

		addProfile: function() {
			var input = this.$('.add-profile-input').val();
			console.log('add', input);
		},
	});

	return GameGridControlsView;
});
