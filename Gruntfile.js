module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {

      files: ['src/*.js'],

       options: {
        reporter: require('jshint-stylish')
      }
    },

    uglify: {
      build: {
        src: 'src/*.js',
        dest: 'dist/script.min.js'
      }
    },

    watch: {
      options: {
        livereload: true
      },
      html: {
        files: ['*.html']
      },
      js: {
        files: ['src/*.js'],
        tasks: ['jshint', 'uglify']
      }
    },

    express:{
      all:{
        options:{
          port:1300,
          hostname:'localhost',
          bases:['.']
        }
      }
    }

  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express');

  // Default tasks.
  grunt.registerTask('default', ['express','watch']);

};