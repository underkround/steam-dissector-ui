
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
			if ( ! this.hasOwner(owner)) {
				this.owners.push(owner);
			}
		},

		removeOwner: function(owner) {
			var ownerId = _.isObject(owner) ? owner.id : owner;
			this.owners = _.filter(this.owners, function(o) {
				return o.id != ownerId;
			});
//			this.owners = _.without(this.owners, owner);
		},

		getOwners: function() {
			return this.owners;
		},

		hasOwner: function(ownerId) {
			return !! this.getOwner(ownerId);
		},

		hasOwners: function() {
			return ! _.isEmpty(this.owners);
		},

		getOwner: function(ownerId) {
			if (_.isObject(ownerId)) {
				ownerId = ownerId.id;
			}
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
