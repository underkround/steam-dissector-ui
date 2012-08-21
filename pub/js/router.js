
define([
	'gamegrid/view/index',
	'about/view/index'
], function(GameGridIndex, AboutIndex){

	var gameGridIndex = new GameGridIndex({
		el: '#app'
	});
	var aboutIndex = new AboutIndex({
		el: '#about'
	});

	var AppRouter = Backbone.Router.extend({
		routes: {
			'about': 'showAbout',
			'*action': 'hideAbout'
		},
		showAbout: function(){
			aboutIndex.render();
		},
		hideAbout: function(){
			aboutIndex.$el.hide();
		},
		showApp: function(){
			gameGridIndex.render();
		}
	});

	return {
		initialize: function(){
			var appRouter = new AppRouter();
			appRouter.showApp();
			Backbone.history.start({
				pushState: true
			});
		}
	};

});
