module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      // options: {
      //   separator: ';',
      // },
      dist: {
        src: ['public/client/*.js'],
        dest: 'public/client/output.js',
      },
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'index.js'
      }
    },

    uglify: {
      my_target: {
        files: {
          'public/dist/output.min.js': ['public/client/output.js']
        }
      }
    },

    jshint: {
      options: {
        '-W030': true
      },
      all: ['app/**/*.js', 'lib/*.js', 'public/client/*.js', '/*.js']
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public/',
          src: ['*.css', '!*.min.css'],
          dest: 'public/dist/',
          ext: '.min.css'
        }]
      }
      // options: {
      //   shorthandCompacting: false,
      //   roundingPrecision: -1
      // },
      // target: {
      //   files: {
      //     '/public/dist/style.css': ['/public/style.css']
      //   }
      // }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push heroku master',
        options: {
          sdtout: true,
          stderr: true,
          failOnError: true
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest',
    'jshint'
  ]);

  grunt.registerTask('build', [
    'concat',
    'cssmin',
    'uglify'
  ]);

  grunt.registerTask('prod', [
    'shell'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run(['shell:prodServer']);
    } else {
      grunt.task.run(['build', 'server-dev']);
    }
  });

  grunt.registerTask('deploy', [
    'test', 'upload'
  ]);


};
