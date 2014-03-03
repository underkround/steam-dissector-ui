
define([
	'jquery',
	'underscore',
	'backbone',
	'gamegrid/model/game-collection'
], function(
	$,
	_,
	Backbone,
	GameCollection
) {

	var ControlsView = Backbone.View.extend({
		events: {
			'click .add-profile': 'onAddProfile',
			'keypress .add-profile-input': 'onAddProfileKeypress'
		},

		initialize: function() {
			var self = this;

			this.inputContainer = this.$('.input-container');
			this.inputEl        = $('.add-profile-input', this.inputContainer);

			this.messagesEl        = $('.add-profile-messages');

			this.progressContainer = this.$('.progress-container');
			this.neutralBar        = $('.bar-neutral', this.progressContainer);
			this.successBar        = $('.bar-success', this.progressContainer);
			this.errorBar          = $('.bar-error', this.progressContainer);
			this.progressCaptionEl = $('.progress-caption', this.progressContainer);

			this.model
				.on('addprofile:error', this.onAddProfileError, this)
				.on('addprofile:success', this.checkAttentionLevel, this);
			this.model.games
				.on('fetchgames:begin', this.fetchGamesBegin, this)
				.on('fetchgames:done', this.fetchGamesEnd, this)
				.on('fetchgames:tick', this.fetchGamesTick, this)
				//.on('fetchgames:error', this.fetchGamesEnd, this)
				.on('add', this.checkAttentionLevel, this);

			this.inputEl.focus();
		},

		checkAttentionLevel: function() {
			if (this.model.games.isEmpty()) {
				this.$el
					.removeClass('sidebar')
					.addClass('attentioned');
			} else {
				this.$el
					.removeClass('attentioned')
					.addClass('sidebar');
			}
		},

		onAddProfileError: function(profile, xhr) {
			this.endProgress();
			this.setError(xhr);
		},

		onAddProfileKeypress: function(event) {
			if (event.which === 13) {
				this.onAddProfile();
			}
		},

		onAddProfile: function() {
			var profileId = this.inputEl.val().trim();
			if (profileId.length == 0) {
				return;
			}

			this.startProgress({
				neutralPercent: 100,
				message: 'Loading profile ' + profileId + '...'
			});
			this.model.addProfile(profileId);
		},

		setError: function(xhr) {
			if (xhr && xhr.statusText) {
				this.messagesEl.html(
					'<div class="alert alert-error">' + xhr.statusText + '</div>'
				);
			} else {
				this.messagesEl.html('');
			}
		},

		startProgress: function(progress) {
			var self = this;
			this.setError();
			this.updateProgress(progress);
			this.inputEl
				.attr('disabled', true);
			this.inputContainer.fadeOut('medium', function() {
				if (self.inputEl.is(':disabled')) {
					self.progressContainer.fadeIn('medium');
				}
			});
		},

		endProgress: function(progress) {
			var self = this;
			this.updateProgress(progress);
			this.inputEl
				.val('')
				.removeAttr('disabled');
			this.progressContainer.fadeOut('medium', function(){
				if ( ! self.inputEl.is(':disabled')) {
					self.inputContainer.fadeIn('medium');
				}
			});
		},

		fetchGamesBegin: function(status) {
			this.updateProgress({
				message: 'Loading games: 0/' + status.loadedCount()
			});
		},

		fetchGamesEnd: function(status) {
			this.endProgress({
				message: 'Loading games: done!'
			});
		},

		fetchGamesTick: function(status) {
			this.updateProgress({
				message: 'Loading games: ' + status.loadedCount() + '/' + status.totalCount(),
				successPercent: status.successPercent(),
				errorPercent:   status.errorPercent()
			});
		},

		updateProgress: function(progress) {
			progress = progress || {};
			this.progressCaptionEl.html(progress.message || '');
			this.neutralBar.css('width', (progress.neutralPercent || 0) + '%');
			this.successBar.css('width', (progress.successPercent || 0) + '%');
			this.errorBar.css('width', (progress.errorPercent || 0) + '%');
		}
	});

	return ControlsView;
});
