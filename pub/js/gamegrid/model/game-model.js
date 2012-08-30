
define([
	'underscore',
	'backbone',
	'config'
], function(
	_,
	Backbone,
	config
){

	var GameModel = Backbone.Model.extend({
		urlRoot: config.gamesUrl,

		initialize: function() {
			this.owners = [];
		},

		addOwner: function(owner) {
			if ( ! this.hasOwners([owner])) {
				this.owners.push(owner);
			}
		},

		removeOwner: function(owner) {
			this.owners = _.without(this.owners, owner);
		},

		getOwners: function() {
			return this.owners;
		},

		hasOwner: function(ownerId) {
			return !! this.getOwner(ownerId);
		},

		getOwner: function(ownerId) {
			return _.find(this.owners, function(owner) {
				return owner.get('id') === ownerId;
			});
		},

		getHoursOnRecord: function() {
			var myId = this.get('id');
			return _.reduce(this.owners, function(memo, owner) {
				return memo + owner.getHoursOnRecordForGame(myId);
			}, 0.0);
		},

		getHoursLast2Weeks: function() {
			var myId = this.get('id');
			return _.reduce(this.owners, function(memo, owner) {
				return memo + owner.getHoursLast2WeeksForGame(myId);
			}, 0.0);
		},

		toJSON: function() {
			var data = _.clone(this.attributes);
			data.owners = [];
			_.each(this.owners, function(owner) {
				data.owners.push(owner.toJSON());
			});
			return data;
		}
	});

	return GameModel;
});
