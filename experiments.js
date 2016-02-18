(function(experiment, undefined){
	// exposed methods
	experiment.init = initExperiment;
	experiment.create = createExperiment;

	// Array containing all Content Experiment ID's loaded on
	// current page.
	var experimentIds = [];

	// Object containing all Content Experiment ID's and
	// variation anonymous functions.
	var experiments = {};

	// Get Google Content Experiment Cookie,
	// value is an Experiment ID.
	var experimentInCookie = $.cookie('experiment');

	// Callback to execute after user data is sent to GA.
	var callback;

	// On page load check if any old Google Content Experiment ID's
	// are being stored in user cookies. If there is a previous 
	// Content Experiment ID stored in user cookies get rid of it!
	clearPastExperiments();

	 /**
	  * Initializes experiments. If there are no active experiments go no further!
	  *
	  * @method initExperiment
	  * @param  {Function} cb Callback to run after experiment data has been xfer'd to GA
	  *
	  */
	function initExperiment(callback){
		var experimentId = experimentInCookie ? experimentInCookie : getRandomExperimentId();

		callback = callback;

		if ( experimentIds.length ) {
			addExperimentScriptToPage(experimentId);
			runExperiment(experimentId);
		}
		else {
			callback();
		}
	}

	/**
	 * Create an experiment on client.
	 *
	 * @method createExperiment
	 * @param  {Object} params 				A config object
	 * @param  {String} params.id 			Google Content Experiment ID
	 * @param  {Array}  params.variations 	Array of anonymous functions
	 */
	function createExperiment(params){
		var errorType = '';

		if ( !params.id || !params.variations ) {
			if ( !params.id ) {
				errorType = 'Google Content Experiment ID';
			}
			else {
				errorType = 'variations';
			}

			console.error('Error: No ' + errorType + ' defined.');
			return;
		}

		if ( experiments[params.id] === undefined ) {
			experiments[params.id] = {};
			experiments[params.id].variations = params.variations;

			experimentIds.push( params.id );
		}
	}

	/**
	 * Load Google Content Experiment library on page
	 *
	 * @method addExperimentScriptToPage
	 * @param  {String} Google Content Experiment ID
	 *
	 */
	function addExperimentScriptToPage(experimentId){
		var script = document.createElement('script');
		
		script.src = '//www.google-analytics.com/cx/api.js?experiment=' + experimentId;
		script.type = 'text/javascript';
		script.async = false;
		document.getElementsByTagName('head')[0].appendChild(script);

		if ( !$.cookie('experiment') ) {
			$.cookie('experiment', experimentId, { path: '/', expires: 30 });
		}
	}

	/**
	 * Get ID of one of the Content Experiments running on page
	 *
	 * @method getRandomExperimentId
	 * @return {String} Returns random Content Experiment ID
	 *
	 */
	function getRandomExperimentId(){
		return experimentIds[Math.floor(Math.random() * experimentIds.length)];
	}

	/**
	 * Executes Google Content Experiment variation
	 *
	 * @method runExperiment
	 * @param {String} Google Content Experiment ID
	 *
	 */
	function runExperiment(experimentId){
		var chosenVariation;

		if ( typeof cxApi === 'undefined' ) {
			window.setTimeout(function(){
				runExperiment( experimentId, callback );
			}, 25);
		}
		else {
			chosenVariation = cxApi.chooseVariation();

			experiments[experimentId].variations[chosenVariation]();

			sendToGA(experimentId);
		}
	}

	/**
	 * Send Content Experiment data to Google Analytics using a
	 * nonInteraction event (does not affect bounce rate, etc).
	 *
	 * @method sendToGA
	 * @param {String} Google Content Experiment ID
	 */
	function sendToGA(experimentId){
		if ( typeof ga === 'undefined' ) {
			window.setTimeout(sendToGA, 250);
		}
		else {
			ga('send', 'event', 'experiment', 'launch', experimentId, {
				nonInteraction: true
			});

			if ( typeof callback === 'function' ) callback();
		}
	}

	/**
	 * Clear old Content Experiment ID from user cookies
	 *
	 * Note: this may need to be altered to do automatically
	 * (if possible).
	 */
	function clearPastExperiments(){
		var pastExperiments = [];

		if ( pastExperiments.indexOf(experimentInCookie) > -1 ) {
			$.cookie('experiment', '', { path: '/', expires: -5 });
			experimentInCookie = null;
		}
	}
}(window.experiment = window.experiment || {}));