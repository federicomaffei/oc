'use strict';

var _ = require('underscore');

var customTasks = {
  build: require('./grunt-tasks/support/task-build'),
  generateCliDoc: require('./grunt-tasks/support/task-generate-cli-doc'),
  version: require('./grunt-tasks/support/task-version')
};

module.exports = function(grunt){

  var taskObject = { pkg: grunt.file.readJSON('package.json') };

  grunt.file.expand('grunt-tasks/*.js', '!grunt-tasks/_*.js').forEach(function(file) {
    var name = file.split('/');
    name = name[name.length - 1].replace('.js', '');
    var task = require('./' + file);

    if(_.isFunction(task)) {
      task(grunt);
    } else {
      taskObject[name] = task;
    }
  });

  grunt.initConfig(taskObject);
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['test-local', 'build']);
  grunt.registerTask('sauce', ['karma:sauce-linux', 'karma:sauce-osx', 'karma:sauce-windows']);
  grunt.registerTask('test-local', ['jshint:all', 'mochaTest:unit', 'mochaTest:acceptance', 'karma:local']);
  grunt.registerTask('test-local-silent', ['jshint:all', 'mochaTest:silent', 'karma:local']);
  grunt.registerTask('test', ['jshint:all', 'mochaTest:unit', 'mochaTest:acceptance']);
  grunt.registerTask('git-stage', [
    'gitadd:versionFiles',
    'gitcommit:version',
    'gittag:addtag',
    'changelog',
    'gitadd:changelog',
    'gitcommit:changelog'
  ]);

  grunt.registerTask('build', 'Builds and minifies the oc-client component', customTasks.build(grunt, taskObject));
  grunt.registerTask('generate-cli-doc', 'Automatically updates the cli.md file', customTasks.generateCliDoc);
  grunt.registerTask('version', 'Does the version upgrade', customTasks.version(grunt, taskObject));
};
