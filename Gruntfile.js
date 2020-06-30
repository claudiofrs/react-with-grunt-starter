// Konfigurasi berdasarkan http://billpatrianakos.me/blog/2017/02/03/using-react-with-webpack-and-es6-in-a-grunt-task/
// dengan beberapa modifikasi seperlunya

module.exports = function(grunt) {

  // Time your grunt tasks and never need to loadGruntTask again
  // require('time-grunt')(grunt);
  // require('load-grunt-tasks')(grunt);
  mode: 'development'

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    project: {
      dev: 'src',
      dist: 'dist',
      build: '<%= grunt.template.today("yyyymmdd") %>'
    },

    // local server
    connect: {
      server: {
        options: {
          host: 'localhost',
          port: '7777',
          base: '<%= project.dev %>/'
        }
      }
    },

    // watch for file changes
    watch: {
      styles: {
        files: ['<%= project.dev %>/css/sass/**/*.scss'],
        tasks: ['sass'],
        options: {
          reload: true,
          livereload: true
        }
      },
      scripts: {
        files: ['<%= project.dev %>/js/dev/**/*.js', 'Gruntfile.js'],
        // tasks: ['webpack:build', 'jshint'], // !important
        tasks: ['webpack:build', 'eslint'], // !important
        options: {
          livereload: true,
          reload: true
        }
      },
      html: {
      	files: ['**/*.html'],
      	options: {
      		livereload: true,
      		reload: true
      	}
      }

    },

    // SASS COMPILE - Compile sass
      sass: {                              
        dist: {                            
          files: {                         
            '<%= project.dev %>/css/style.css': ['<%= project.dev %>/css/sass/style.scss']
          },
          options: {                       
            style: 'nested',
            noCache: true,
            quiet: false
            },            
        }
      },

    // lint js
    eslint: {
      target: ['<%= project.dev %>/js/dev/**/*.js', '<%= project.dev %>/js/dev/index.js']
    },

    // webpack !pay attention to this task!
    webpack: {
      build: {
        mode: 'development',
        entry: ['./src/js/dev/index.js'],
        output: {
          path: __dirname + '/src/js',
          filename: 'app.js'
        },
        stats: {
          colors: false,
          modules: true,
          reasons: true
        },
        storeStatsTo: 'webpackStats',
        progress: true,
        failOnError: true,
        watch: true,
        keepalive: false, // biar ga blocking task selanjutnya
        module: {
          rules: [
            { test: /\.(js|jsx)$/, 
              exclude: /node_modules/, 
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    presets: ['react']
                  }
                }
              ]
            }
          ]
        }
      }
    }
  });

  // Tasks
  
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-eslint');

  grunt.registerTask('default', ['develop']);
  grunt.registerTask('develop', [
    'connect:server',
    'watch'
    ]);
};