module.exports = function(grunt) {

	grunt.initConfig({
		jasmine: {
			pivotal: {
				src: ['assets/dev/js/jquery.js', 'assets/dev/js/underscore.js', 'assets/dev/js/backbone.js', 'assets/dev/js/app.js'],
				options: {
					specs: 'test/spec/*.js',
					helpers: 'test/*Helper.js'
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jasmine');
};