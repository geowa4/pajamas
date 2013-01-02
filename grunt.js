module.exports = function(grunt) {

  grunt.initConfig({
    pkg    : '<json:package.json>'
  , meta   : {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        '<%= pkg.author %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
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
      dist : {
        src  : [
          '<banner:meta.banner>'
        , '<file_strip_banner:src/<%= pkg.name %>.js>'
        ]
      , dest : 'dist/<%= pkg.name %>.js'
      }
    }
  , min    : {
      dist : {
        src  : [
          '<banner:meta.banner>'
        , '<config:concat.dist.dest>'
        ]
      , dest : 'dist/<%= pkg.name %>.min.js'
      }
    }
  , watch  : {
      files : '<config:lint.files>'
    , tasks : 'lint qunit'
    }
  , server : {
      port : 8000
    , base : '.'
    }
  , jshint : {
      options : {
        camelcase : true
      , eqeqeq    : true
      , forin     : true
      , immed     : true
      , latedef   : true
      , newcap    : true
      , noarg     : true
      , nonew     : true
      , quotmark  : 'single'
      , undef     : true
      , unused    : true
      , trailing  : true
      , asi       : true
      , eqnull    : true
      , evil      : true
      , expr      : true
      , laxbreak  : true
      , laxcomma  : true
      , sub       : true
      , browser   : true
      , onevar    : true
      }
    , globals : {
        QUnit   : true
      , define  : true
      , module  : true
      , exports : true
      , require : true
      , ender   : true
      }
    }
  , uglify : {}
  , clean  : {
      dist : ['dist']
    }
  })

  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-clean')

  grunt.registerTask('default', 'lint build qunit')

  grunt.registerTask('build', 'copy concat min')

  grunt.registerTask('test', 'server watch')

}
