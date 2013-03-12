var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet
  , mountFolder = function (connect, dir) {
      return connect['static'](require('path').resolve(dir))
    }

module.exports = function(grunt) {

  grunt.initConfig({
    pkg    : grunt.file.readJSON('package.json')
  , meta   : {
      banner :
        '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n'
    }
  , qunit  : {
      files: ['test/*/*.html']
    }
  , copy   : {
      dist : {
        files : {
          'dist/ender.js' : 'src/ender.js'
        }
      }
    }
  , concat : {
      options : {
        banner: '<%= meta.banner %>'
      }
    , dist : {
        src  : [
          'src/<%= pkg.name %>.js'
        ]
      , dest : 'dist/<%= pkg.name %>.js'
      }
    }
  , uglify : {
      options : {
        banner: '<%= meta.banner %>'
      }
    , dist : {
        src  : [
          'dist/<%= pkg.name %>.js'
        ]
      , dest : 'dist/<%= pkg.name %>.min.js'
      }
    }
  , watch  : {
      livereload : {
        files : ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', 'test/**/*.html']
      , tasks : ['livereload']
      }
    , js : {
        files : '<%= jshint.files %>'
      , tasks : ['jshint', 'qunit']
      }
    }
  , connect : {
      options : {
        port     : 4000
      , hostname : 'localhost'
      }
    , livereload : {
        options : {
          middleware : function (connect) {
            return [
              lrSnippet
            , mountFolder(connect, '.')
            ]
          }
        }
      }
    }
  , open   : {
      server : {
        path : 'http://localhost:<%= connect.options.port %>/test/index.html'
      }
    }
  , jshint : {
      files   : ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    , options : {
        jshintrc : '.jshintrc'
      }
    }
  , clean  : {
      dist : ['.tmp', 'dist']
    , server: '.tmp'
    }
  })

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
     return grunt.task.run(['build', 'open', 'connect:dist:keepalive'])
    }

    grunt.task.run([
      'clean:server'
    , 'livereload-start'
    , 'connect:livereload'
    , 'open'
    , 'watch:livereload'
    ])
  })

  grunt.registerTask('default', ['jshint', 'build', 'qunit'])

  grunt.registerTask('build', ['copy', 'concat', 'uglify'])

  grunt.registerTask('test', ['server', 'watch:js'])

}
