
define([
//	'text!tpl/about/index'
], function(templateText) {

	return Backbone.View.extend({
		render: function(){
			this.$el
				.show()
				.html('<p>About this project</p>');
		}
	});

});
