
define([
	'underscore'
], function(
	_
){

	var percentValue = function(done, from) {
		return (from > 0) ? Math.round(done / from * 100) : 0;
	};

	var alphabeticalCompare = function(a, b) {
		var aa = a.toString().toLowerCase(), bb = b.toString().toLowerCase();
		if (aa < bb) return -1;
		if (aa > bb) return 1;
		return 0;
	}

	//
	// LoadStatus
	//
	// ..yeah, this thing might already be implemented (bug-free) somewhere.. oh well
	//
	var LoadStatus = function(totalItems, doneCallback) {
		this.totalItems = totalItems;
		this.successItems = [];
		this.errorItems = [];
		this.doneCallback = _.once(doneCallback);
		if (this.isDone()) {
			this.doneCallback();
		}
	};

	LoadStatus.prototype.success = function(item) {
		this.successItems.push(item);
		if (this.isDone()) {
			this.doneCallback();
		}
	};
	LoadStatus.prototype.error = function(item) {
		this.errorItems.push(item);
		if (this.isDone()) {
			this.doneCallback();
		}
	};

	LoadStatus.prototype.totalCount = function() {
		return this.totalItems.length;
	};
	LoadStatus.prototype.loadedCount = function() {
		return this.successCount() + this.errorCount();
	};
	LoadStatus.prototype.successCount = function() {
		return this.successItems.length;
	};
	LoadStatus.prototype.errorCount = function() {
		return this.errorItems.length;
	};

	LoadStatus.prototype.successPercent = function() {
		return percentValue(this.successCount(), this.totalCount());
	};
	LoadStatus.prototype.errorPercent = function() {
		return percentValue(this.errorCount(), this.totalCount());
	};
	LoadStatus.prototype.loadedPercent = function() {
		return percentValue(this.loadedCount(), this.totalCount());
	};

	LoadStatus.prototype.isDone = function() {
		return (this.loadedCount() >= this.totalCount());
	};

	//
	// Utils
	//
	return {
		LoadStatus: LoadStatus,
		alphabeticalCompare: alphabeticalCompare
	};

});
