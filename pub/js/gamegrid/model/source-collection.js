/**
 * GameGridSourceCollection
 */

define(function(){

	var GameGridSourceCollection = Backbone.Collection.extend({
		initialize: function() {
			this.games = {};
			this.profiles = {};
		}
	});

	return GameGridSourceCollection;

});
