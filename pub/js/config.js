define([], (function(){
	var baseUrl = '/backend';

	return {
		baseUrl:     baseUrl,
		gamesUrl:    baseUrl + '/games',
		profilesUrl: baseUrl + '/profiles',
		debug:       false,
		tickUpdateInterval: 1000
	}
})()
);
