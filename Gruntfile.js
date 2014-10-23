// Copyright (c) 2014 The Finnish National Board of Education - Opetushallitus
//
// This program is free software:  Licensed under the EUPL, Version 1.1 or - as
// soon as they will be approved by the European Commission - subsequent versions
// of the EUPL (the "Licence");
//
// You may not use this work except in compliance with the Licence.
// You may obtain a copy of the Licence at: http://www.osor.eu/eupl/
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// European Union Public Licence for more details.

'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'src/js/**/*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        autoWatch: false,
        singleRun: true
      },
      unit_ff: {
        configFile: 'karma.conf.js',
        autoWatch: false,
        singleRun: true,
        browsers: ['Firefox'],
        colors: false
      },
      unit_auto: {
        configFile: 'karma.conf.js'
      }
    },
  });

  grunt.registerTask('test', ['jshint', 'karma:unit']);

  var test_ff = ['jshint', 'karma:unit_ff'];
  grunt.registerTask('test_ff', test_ff);

  grunt.registerTask('autotest', ['karma:unit_auto']);

  grunt.registerTask('default', test_ff);
};
