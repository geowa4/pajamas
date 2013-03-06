var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet
  , mountFolder = function (connect, dir) {
      return connect.static(require('path').resolve(dir))
    }

module.exports = function(grunt) {

  grunt.initConfig({
    pkg    : grunt.file.readJSON('package.json')
  , meta   : {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n'
      /*'/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        '<%= pkg.author %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> * /'*/
    }
  , lint   : {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    }
  , qunit  : {
      files: ['test/**/*.html']
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
        files: [
          '<%= lint.files %>'
        ]
      , tasks: ['livereload']
      }
    , js : {
        files : '<%= lint.files %>'
      , tasks : 'lint qunit'
      }
    }
  , connect : {
      options : {
        port     : 9000
      , hostname : 'localhost'
      }
    }
  , open   : {
      server : {
        path : 'http://localhost:<%= connect.options.port %>'
      }
    }
  , jshint : {
      all     : [
        'src/<%= pkg.name %>.js'
      ]
    , options : {
        jshintrc : '.jshintrc'
      }
    , 
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
    , 'watch'
    ])
  })

  grunt.registerTask('default', ['jshint', 'build', 'qunit'])

  grunt.registerTask('build', ['copy', 'concat', 'uglify'])

  grunt.registerTask('test', ['server', 'watch:js'])

}
