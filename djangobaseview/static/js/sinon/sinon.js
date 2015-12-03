define([
	'dojo/text!./sinon-1.9.0.js'
], function(sinonText) {
	// Not to eval the script in the global scope.
	return (function() {
		return eval(sinonText + '; this.sinon;');
	}).call({});
});
